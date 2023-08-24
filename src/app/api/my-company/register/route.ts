import { connectToDatabase } from "@lib";
import { NextRequest } from "next/server";
import z from "zod";
import { ServerResponse } from "@helpers";
import axios from "axios";
import { hasDuplicates } from "@utils";
import {
  typeOfBusinesses,
  services,
  marketSegmentFocus,
  technologiesUsed,
  operatingRegions as operatingRegionsList,
} from "@/app/(pages)/(protected)/my-company/register/formOptions";

const CompanySchema = z
  .object({
    company_name: z.string({ required_error: "Company name required" }),
    operating_regions: z
      .string()
      .array()
      .nonempty("At least 1 valid operating region required"),
    type_of_business: z
      .string()
      .array()
      .nonempty("Valid type of business required"),
    services_or_products: z
      .string()
      .array()
      .nonempty("At least 1 valid service / product required"),
    technologies_used: z
      .string()
      .array()
      .nonempty("At least 1 valid technology used required"),
    market_segment_focus: z
      .string()
      .array()
      .nonempty("At least 1 valid market segment focus required"),
    less_than_2_years: z.boolean().optional(),
    years_in_business: z.string().optional(),
    headquarters_location: z.string({
      required_error: "Headquarters location required",
    }),
  })
  .refine(
    (data) => data.less_than_2_years || data.years_in_business,
    "Either years in business input or less than 2 years checkbox should be filled in"
  );

type Company = z.infer<typeof CompanySchema>;

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body: Company = await request.json();

  const validation = CompanySchema.safeParse(body);

  if (validation.success) {
    try {
      if (body.less_than_2_years) {
        body.years_in_business = "<2";
      }

      const gmapData = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/maps/query/cities`,
        {
          input: body.headquarters_location,
        }
      );

      // check if real google maps location
      if (
        gmapData?.data?.predictions?.[0]?.description !==
        body.headquarters_location
      ) {
        return ServerResponse.userError("Invalid headquarters location");
      }

      // checks if body is NOT a subset of total list
      if (
        !body.operating_regions.every((val) =>
          operatingRegionsList.includes(val)
        )
      ) {
        ServerResponse.userError("Invalid operating regions");
      }

      if (hasDuplicates(body.operating_regions)) {
        ServerResponse.userError("Duplicate operating regions found");
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
