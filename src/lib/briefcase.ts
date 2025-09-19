
import type { BriefcaseData } from "@/app/briefcase/page";

export const initialBriefcase: BriefcaseData = {
    recordNumber: `USER-GUEST`,
    applicantName: "Guest User",
    agreements: {
        ndaContent: "No Non-Disclosure Agreement found. Please complete the partner application to generate one.",
        serviceAgreementContent: "No Service Agreement found. Please complete the partner application to generate one.",
    },
    date: new Date().toISOString(),
    registrations: [],
    userDocuments: [],
    savedBoqs: [],
};
