export const GOOGLE_CLIENT_ID =
  "1055061835288-rj4g5oc48f5ked2utgpnv554ns3a4h9u.apps.googleusercontent.com";

export const GOOGLE_CLIENT_SECRET = "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";

let apiBaseUrl: string = "";

if (process.env.REACT_APP_ENV === "production") {
  apiBaseUrl = "https://recruit.searchtalent.de";
} else if (process.env.REACT_APP_ENV === "staging") {
  apiBaseUrl = "https://recruit-staging.searchtalent.de";
} else {
  apiBaseUrl = "http://localhost:4560";
}

export { apiBaseUrl };

export const RECUNITED_ADMIN_KEY = "gmiL76NyKONutwFFI4Mm";

export const UNEDITABLE_FIELDS = [
  "id",
  "created_time",
  "nature_of_value",
  "max_threshold",
];
