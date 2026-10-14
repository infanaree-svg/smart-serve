import Types "../types/ai";
import AiLib "../lib/ai";

mixin () {
  /// Generates a fresh AI daily recommendation from sales and customer behaviour.
  public shared func refreshRecommendation() : async Types.DailyRecommendation {
    await* AiLib.generateRecommendation<system>();
  };
};
