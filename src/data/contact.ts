export type SocialId = "github" | "linkedin" | "codeforces" | "leetcode";

export interface Social {
  id: SocialId;
  label: string;
  /** Profile URL. খালি ("") থাকলে এই card দেখাবে না। */
  url: string;
};

export const contact = {
  email: "shorafothoshen@gmail.com",
  location: "Bangladesh",
  socials: [
    { id: "github", label: "GitHub", url: "https://github.com/shorafothoshen" },
    // ⚠️ নিচের 3টা URL আমার জানা নেই, তাই খালি রাখা হয়েছে। নিজের profile link বসাও।
    // যতক্ষণ খালি থাকবে ততক্ষণ ওই card দেখাবে না। (উদাহরণ: "https://www.linkedin.com/in/your-id")
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/shorafothoshen/" },
    { id: "codeforces", label: "Codeforces", url: "https://codeforces.com/profile/Shorafot_hoshen98" },
    { id: "leetcode", label: "LeetCode", url: "https://leetcode.com/u/shorafothoshen/" },
  ] satisfies Social[],
};