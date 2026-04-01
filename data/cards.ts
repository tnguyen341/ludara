import type { CardType, Pack } from "@/types";

export const LUDARA_PACK: Pack = {
  id: "ludara",
  name: "Ludara",
  description: "A hand of ideas worth debating.",
  accentColor: "#c9a84c",
  glowColor: "rgba(201,168,76,0.5)",
  symbol: "✦",
  gradient: "linear-gradient(135deg, #1a0d04 0%, #0e0701 100%)",
};

export const IDEAS: CardType[] = [
  // ── Technology ────────────────────────────────────────────────────────────
  {
    id: "tech-open-source-governance",
    name: "Open-Source Governance",
    description:
      "Should major open-source projects be run by elected democratic committees rather than benevolent dictators?",
    category: "Technology",
  },
  {
    id: "tech-ai-creativity",
    name: "AI and Creative Labor",
    description:
      "Does AI-generated art represent genuine creativity, or is it sophisticated plagiarism of human work?",
    category: "Technology",
  },
  {
    id: "tech-privacy-tradeoff",
    name: "Privacy vs Convenience",
    description:
      "Is surrendering personal data a reasonable price for free, personalized digital services?",
    category: "Technology",
  },
  {
    id: "tech-automation-jobs",
    name: "Automation and Employment",
    description:
      "Will widespread automation ultimately create more jobs than it destroys, or mark a permanent structural shift?",
    category: "Technology",
  },
  {
    id: "tech-algo-bias",
    name: "Algorithmic Hiring Bias",
    description:
      "Do algorithmic hiring tools reduce human bias, or do they encode and scale it at unprecedented speed?",
    category: "Technology",
  },

  // ── Society ───────────────────────────────────────────────────────────────
  {
    id: "soc-ubi",
    name: "Universal Basic Income",
    description:
      "Would a guaranteed income floor liberate human potential and reduce poverty, or erode the incentive to work?",
    category: "Society",
  },
  {
    id: "soc-four-day-week",
    name: "The Four-Day Workweek",
    description:
      "Should productivity gains from technology translate into shorter work weeks rather than higher economic output?",
    category: "Society",
  },
  {
    id: "soc-mandatory-voting",
    name: "Mandatory Voting",
    description:
      "Should voting be compulsory in democracies to ensure governments truly represent all citizens, not just the motivated?",
    category: "Society",
  },
  {
    id: "soc-prison-rehab",
    name: "Punishment vs Rehabilitation",
    description:
      "Should prison systems prioritize deterrence and punishment, or rehabilitation and reintegration into society?",
    category: "Society",
  },
  {
    id: "soc-social-media-democracy",
    name: "Social Media and Democracy",
    description:
      "Do social media platforms strengthen democratic participation, or do they fundamentally undermine it through polarization?",
    category: "Society",
  },

  // ── Nature ────────────────────────────────────────────────────────────────
  {
    id: "nat-urban-rewilding",
    name: "Urban Rewilding",
    description:
      "Should cities systematically convert underused land to wild habitat, even at the cost of housing and development?",
    category: "Nature",
  },
  {
    id: "nat-nuclear-green",
    name: "Nuclear Power as Green Energy",
    description:
      "Is nuclear power a necessary bridge to a carbon-free future, or an unacceptable long-term risk to accept?",
    category: "Nature",
  },
  {
    id: "nat-lab-meat",
    name: "Lab-Grown Meat Adoption",
    description:
      "Should governments actively incentivize the shift from traditional livestock farming to cultivated meat?",
    category: "Nature",
  },
  {
    id: "nat-geoengineering",
    name: "Climate Geoengineering",
    description:
      "Is deliberately modifying Earth's climate systems — blocking sunlight, seeding clouds — an ethical response to crisis?",
    category: "Nature",
  },
  {
    id: "nat-insect-protein",
    name: "Insects as Food",
    description:
      "Should Western cultures embrace insect consumption as a sustainable protein source, or is cultural resistance decisive?",
    category: "Nature",
  },

  // ── Philosophy ────────────────────────────────────────────────────────────
  {
    id: "phi-free-will",
    name: "Free Will vs Determinism",
    description:
      "If every decision is caused by prior events, is moral responsibility a coherent concept or a useful fiction?",
    category: "Philosophy",
  },
  {
    id: "phi-ai-consciousness",
    name: "Machine Consciousness",
    description:
      "Could a sufficiently complex AI system ever be genuinely conscious, or can it only simulate the appearance of inner experience?",
    category: "Philosophy",
  },
  {
    id: "phi-moral-relativism",
    name: "Moral Relativism",
    description:
      "Is there a universal moral standard binding all cultures, or do ethical norms only make sense within their context?",
    category: "Philosophy",
  },
  {
    id: "phi-right-to-forget",
    name: "The Right to Be Forgotten",
    description:
      "Should individuals have a legal right to erase accurate but embarrassing or damaging information about themselves?",
    category: "Philosophy",
  },
  {
    id: "phi-obligation-future",
    name: "Obligations to Future Generations",
    description:
      "Do present generations have binding moral duties to people who do not yet exist, even at significant cost to ourselves?",
    category: "Philosophy",
  },

  // ── Design ────────────────────────────────────────────────────────────────
  {
    id: "des-dark-patterns",
    name: "Dark Patterns as Consumer Fraud",
    description:
      "Should manipulative UI patterns that exploit cognitive biases — fake urgency, hidden unsubscribes — be regulated as fraud?",
    category: "Design",
  },
  {
    id: "des-accessibility-constraint",
    name: "Accessibility as Creative Constraint",
    description:
      "Does designing for accessibility produce better, more universal outcomes, or does it fundamentally limit creative expression?",
    category: "Design",
  },
  {
    id: "des-planned-obsolescence",
    name: "Planned Obsolescence",
    description:
      "Should manufacturers be legally prohibited from intentionally engineering products to fail or become unfashionable?",
    category: "Design",
  },
  {
    id: "des-standardization",
    name: "Standardization vs Customization",
    description:
      "Does design standardization — platform UI guidelines, consistent patterns — serve users better than expressive customization?",
    category: "Design",
  },
  {
    id: "des-brutalism",
    name: "Brutalist Web Design",
    description:
      "Is the resurgence of brutalist aesthetics a meaningful critique of sanitized corporate web design, or mere contrarianism?",
    category: "Design",
  },

  // ── Economics ─────────────────────────────────────────────────────────────
  {
    id: "eco-wealth-redistribution",
    name: "Redistribution vs Growth",
    description:
      "Is aggressive wealth redistribution necessary for a healthy society, or does it stifle the innovation that raises living standards?",
    category: "Economics",
  },
  {
    id: "eco-crypto-currency",
    name: "Cryptocurrency as Currency",
    description:
      "Can decentralized digital currencies realistically displace state-backed money, or are they fundamentally speculative assets?",
    category: "Economics",
  },
  {
    id: "eco-rent-control",
    name: "Rent Control Effectiveness",
    description:
      "Does rent control protect vulnerable tenants, or does it reduce housing supply and ultimately harm the people it intends to help?",
    category: "Economics",
  },
  {
    id: "eco-patent-system",
    name: "Patents and Innovation",
    description:
      "Do patents incentivize innovation by rewarding inventors, or do they create monopolies that lock down progress?",
    category: "Economics",
  },
  {
    id: "eco-minimum-wage",
    name: "Minimum Wage and Employment",
    description:
      "Does raising the minimum wage meaningfully improve worker welfare, or does it price low-skill workers out of the labor market?",
    category: "Economics",
  },
];
