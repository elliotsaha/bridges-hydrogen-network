export declare const bg: {
    readonly lucia: (text: string) => string;
    readonly red: (text: string) => string;
    readonly white: (text: string) => string;
    readonly green: (text: string) => string;
    readonly cyan: (text: string) => string;
    readonly yellow: (text: string) => string;
    readonly purple: (text: string) => string;
    readonly blue: (text: string) => string;
};
export declare const fg: {
    readonly lucia: (text: string) => string;
    readonly red: (text: string) => string;
    readonly white: (text: string) => string;
    readonly green: (text: string) => string;
    readonly cyan: (text: string) => string;
    readonly yellow: (text: string) => string;
    readonly purple: (text: string) => string;
    readonly blue: (text: string) => string;
    readonly default: (text: string) => string;
};
export declare const bold: (text: string) => string;
export declare const enableDebugMode: () => void;
export declare const debug: {
    readonly init: (debugEnabled: boolean) => void;
    readonly request: {
        readonly info: (text: string, subtext?: string) => void;
        readonly notice: (text: string, subtext?: string) => void;
        readonly fail: (text: string, subtext?: string) => void;
        readonly success: (text: string, subtext?: string) => void;
        readonly init: (method: string, href: string) => void;
    };
    readonly session: {
        info: (text: string, subtext?: string) => void;
        notice: (text: string, subtext?: string) => void;
        fail: (text: string, subtext?: string) => void;
        success: (text: string, subtext?: string) => void;
    };
    readonly key: {
        info: (text: string, subtext?: string) => void;
        notice: (text: string, subtext?: string) => void;
        fail: (text: string, subtext?: string) => void;
        success: (text: string, subtext?: string) => void;
    };
};
