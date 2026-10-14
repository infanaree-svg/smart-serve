import Common "common";

module {
  /// One point in a sales/orders time series.
  public type SalesPoint = {
    timeLabel : Text; // e.g. "12:00" or "จ."
    sales : Common.Satang;
    orders : Nat;
  };

  /// Aggregate sales report over a period.
  public type SalesReport = {
    totalSales : Common.Satang;
    totalOrders : Nat;
    series : [SalesPoint];
  };

  /// A single KPI tile.
  public type Kpi = {
    timeLabel : Text;
    value : Text; // pre-formatted display value, e.g. "฿4,820"
    changePercent : Float; // e.g. 12.0 or -6.0
    changeLabel : Text; // e.g. "+12%"
  };

  /// Dashboard KPI set.
  public type KpiSummary = {
    todaySales : Kpi;
    estimatedProfit : Kpi;
    orders : Kpi;
    averageWait : Kpi;
  };

  /// Queue and delivery counts shown on the dashboard.
  public type DeliverySummary = {
    dineInQueue : Nat; // คิวหน้าร้าน
    onlineOrders : Nat; // ออเดอร์ออนไลน์
    delivering : Nat; // กำลังจัดส่ง
  };

  /// Restaurant settings.
  public type Settings = {
    restaurantName : Text;
    openTime : Text;
    closeTime : Text;
    averagePrepMinutes : Nat;
  };

  /// Input for updating restaurant settings.
  public type SettingsUpdate = {
    restaurantName : Text;
    openTime : Text;
    closeTime : Text;
    averagePrepMinutes : Nat;
  };

  /// Monthly subscription package details.
  public type PackageInfo = {
    pricePerMonth : Common.Satang; // e.g. 99000
    badge : Text; // e.g. "คุ้มค่า!"
    trialLabel : Text; // e.g. "ใช้ฟรี 7 วัน"
    features : [Text];
  };
};
