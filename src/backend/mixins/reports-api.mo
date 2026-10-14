import Types "../types/reports";
import ReportsLib "../lib/reports";

mixin (settings : { var value : Types.Settings }) {
  /// Returns the sales report for the given period label.
  public query func getSalesReport(period : Text) : async Types.SalesReport {
    ReportsLib.getSalesReport(period);
  };

  /// Returns the dashboard KPI set.
  public query func getKpiSummary() : async Types.KpiSummary {
    ReportsLib.getKpiSummary();
  };

  /// Returns the queue and delivery counts.
  public query func getDeliverySummary() : async Types.DeliverySummary {
    ReportsLib.getDeliverySummary();
  };

  /// Returns the restaurant settings.
  public query func getSettings() : async Types.Settings {
    ReportsLib.getSettings(settings);
  };

  /// Updates the restaurant settings.
  public shared func updateSettings(input : Types.SettingsUpdate) : async Types.Settings {
    ReportsLib.updateSettings(settings, input);
  };

  /// Returns the monthly subscription package details.
  public query func getPackageInfo() : async Types.PackageInfo {
    ReportsLib.getPackageInfo();
  };
};
