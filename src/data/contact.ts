export type SocialId = "github" | "linkedin" | "codeforces" | "leetcode";

export interface Social {
  id: SocialId;
  label: string;
  url: string;
};

export const contact = {
  email: "shorafothoshen@gmail.com",
  phone: "+8801817822166",
  location: "Bangladesh",
  socials: [
    { id: "github", label: "GitHub", url: "https://github.com/shorafothoshen" },
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/shorafothoshen/" },
    { id: "codeforces", label: "Codeforces", url: "https://codeforces.com/profile/Shorafot_hoshen98" },
    { id: "leetcode", label: "LeetCode", url: "https://leetcode.com/u/shorafothoshen/" },
  ] satisfies Social[],
};