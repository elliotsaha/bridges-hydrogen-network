import { connectToDatabase } from "@lib";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { ServerResponse } from "@helpers";
import axios from "axios";
import { hasDuplicates } from "@utils";
import {
  typeOfBusinesses,
  services,
  marketSegmentFocus,
  technologiesUsed,
  operatingRegions,
} from "@/app/(pages)/(protected)/my-company/register/formOptions";
import { getSession } from "@helpers";

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
    less_than_2_years: z.boolean({
      required_error: "Less than 2 years field is required",
    }),
    years_in_business: z.number().int().gte(2).optional(),
    headquarters_location: z.string({
      required_error: "Headquarters location required",
    }),
  })
  .refine((data) => {
    if (!data.less_than_2_years) {
      return data.hasOwnProperty("years_in_business");
    }
    return true;
  }, "Either years in business input or less than 2 years checkbox should be filled in");

type Company = z.infer<typeof CompanySchema>;

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body: Company = await request.json();

  const session = getSession(request);

  if (!session) {
    ServerResponse.unauthorizedError();
  }

  // checks if field input entry is included in total list of
  // all possible inputs as well as if input is not duplicated multiple times in list
  const checkValidEntries = (
    key: keyof Company,
    possibleInputsList: Array<string>,
    errMsg: string
  ) => {
    if (Array.isArray(body[key])) {
      if (
        !(body[key] as Array<string>).every((val) =>
          possibleInputsList.includes(val)
        )
      ) {
        return ServerResponse.userError(errMsg);
      }

      if (hasDuplicates(body[key] as Array<unknown>)) {
        return ServerResponse.userError("Duplicate inputs found");
      }
    } else {
      return ServerResponse.userError("Structure has been modified");
    }
  };

  const typeValidation = CompanySchema.safeParse(body);

  if (typeValidation.success) {
    try {
      inputValidation(checkValidEntries);

      if (body.less_than_2_years) {
        delete body["years_in_business"];
      }

      const gmapData = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/maps/query/cities`,
        {
          input: body.headquarters_location,
        }
      );

      // check if real google maps location
      if (!gmapData) {
        return ServerResponse.serverError(
          "Google Maps API could not be loaded"
        );
      }

      if (
        gmapData?.data?.predictions?.[0]?.description !==
        body.headquarters_location
      ) {
        return ServerResponse.userError("Invalid headquarters location");
      }

      return ServerResponse.success(body);
    } catch (e) {
      return ServerResponse.serverError("Something unexpected went wrong");
    }
  } else {
    return ServerResponse.validationError(typeValidation);
  }
};

const inputValidation = (
  validate: (
    key: keyof Company,
    possibleInputsList: Array<string>,
    errMsg: string
  ) => NextResponse | undefined
  // NextResponse means error has occured and undefined means all checks passes
) => {
  // valid market segment focus check
  validate(
    "market_segment_focus",
    marketSegmentFocus.map((v) => v.name),
    "Invalid market segment focus values"
  );

  // valid operating regions check
  validate("operating_regions", operatingRegions, "Invalid operating regions");

  // services or products check
  validate(
    "services_or_products",
    services.map((v) => v.name),
    "Invalid services or products"
  );

  // technologies used check
  validate(
    "technologies_used",
    technologiesUsed.flatMap((section) =>
      section.technologies.map((v) => (typeof v === "string" ? v : v.name))
    ), // flattens technologies used list into 1-dimensional list
    "Invalid technologies used"
  );

  // type of businesses check
  validate(
    "type_of_business",
    typeOfBusinesses.map((v) => v.name),
    "Invalid business types used"
  );
};
