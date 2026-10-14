module {
  /// A single AI-generated recommendation card.
  public type Recommendation = {
    title : Text;
    detail : Text;
  };

  /// The AI daily recommendation payload.
  public type DailyRecommendation = {
    generatedAt : Nat; // nanoseconds since the Unix epoch
    items : [Recommendation];
  };
};
