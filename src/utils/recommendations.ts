import { Product, UserPersona } from '../types';

export function calculateProductMatch(product: Product, user: UserPersona | null): { score: number; reason: string } {
  if (!user) {
    return {
      score: 85,
      reason: 'Popular Community Choice'
    };
  }

  let score = 50;
  const reasons: string[] = [];

  // 1. Skin type match
  if (product.skinTypes.includes(user.skinType)) {
    score += 25;
    reasons.push(`${user.skinType} Skin`);
  }

  // 2. Concerns match
  const matchedConcerns = product.concerns.filter(c => user.concerns.includes(c));
  if (matchedConcerns.length > 0) {
    score += Math.min(20, matchedConcerns.length * 10);
    reasons.push(`Targets ${matchedConcerns[0]}`);
  }

  // 3. Aesthetic / Finish match
  if (user.aestheticPreference.includes('Dewy') && (product.finish === 'Dewy' || product.finish === 'Radiant')) {
    score += 15;
    if (reasons.length < 2) reasons.push('Dewy Glass Finish');
  } else if (user.aestheticPreference.includes('Velvet') && product.finish === 'Velvet Matte') {
    score += 15;
    if (reasons.length < 2) reasons.push('Velvet Matte Touch');
  } else if (user.aestheticPreference.includes('Clean') && product.badge === 'Clean Beauty') {
    score += 15;
    if (reasons.length < 2) reasons.push('Clean Formulation');
  }

  // Cap between 60% and 99%
  const finalScore = Math.min(99, Math.max(65, score));
  const finalReason = reasons.length > 0 
    ? reasons.slice(0, 2).join(' · ') 
    : `Curated for ${user.aestheticPreference}`;

  return {
    score: finalScore,
    reason: finalReason
  };
}

export function getPersonalizedProducts(products: Product[], user: UserPersona | null): Product[] {
  return products.map(product => {
    const { score, reason } = calculateProductMatch(product, user);
    return {
      ...product,
      matchScore: score,
      matchReason: reason
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}
