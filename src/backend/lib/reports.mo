import Types "../types/reports";

module {
  /// Returns the sales report for the given period label.
  public func getSalesReport(period : Text) : Types.SalesReport {
    let series : [Types.SalesPoint] = switch (period) {
      case ("today") {
        [
          { timeLabel = "09:00"; sales = 32000; orders = 3 },
          { timeLabel = "10:00"; sales = 58000; orders = 5 },
          { timeLabel = "11:00"; sales = 124000; orders = 9 },
          { timeLabel = "12:00"; sales = 186000; orders = 14 },
          { timeLabel = "13:00"; sales = 142000; orders = 11 },
          { timeLabel = "14:00"; sales = 96000; orders = 7 },
          { timeLabel = "15:00"; sales = 64000; orders = 5 },
        ];
      };
      case ("30d") {
        [
          { timeLabel = "สัปดาห์ 1"; sales = 2480000; orders = 198 },
          { timeLabel = "สัปดาห์ 2"; sales = 2615000; orders = 209 },
          { timeLabel = "สัปดาห์ 3"; sales = 2742000; orders = 221 },
          { timeLabel = "สัปดาห์ 4"; sales = 2896000; orders = 234 },
        ];
      };
      case (_) {
        [
          { timeLabel = "จ."; sales = 382000; orders = 31 },
          { timeLabel = "อ."; sales = 415000; orders = 34 },
          { timeLabel = "พ."; sales = 398000; orders = 33 },
          { timeLabel = "พฤ."; sales = 452000; orders = 37 },
          { timeLabel = "ศ."; sales = 512000; orders = 42 },
          { timeLabel = "ส."; sales = 548000; orders = 45 },
          { timeLabel = "อา."; sales = 482000; orders = 38 },
        ];
      };
    };
    var totalSales = 0;
    var totalOrders = 0;
    for (point in series.values()) {
      totalSales += point.sales;
      totalOrders += point.orders;
    };
    { totalSales; totalOrders; series };
  };

  /// Returns the dashboard KPI set.
  public func getKpiSummary() : Types.KpiSummary {
    {
      todaySales = { timeLabel = "ยอดขายวันนี้"; value = "฿4,820"; changePercent = 12.0; changeLabel = "+12%" };
      estimatedProfit = { timeLabel = "กำไรโดยประมาณ"; value = "฿1,450"; changePercent = 15.0; changeLabel = "+15%" };
      orders = { timeLabel = "ออเดอร์"; value = "38"; changePercent = 9.0; changeLabel = "+9%" };
      averageWait = { timeLabel = "เวลารอเฉลี่ย"; value = "12 นาที"; changePercent = -6.0; changeLabel = "-6 นาที" };
    };
  };

  /// Returns the queue and delivery counts.
  public func getDeliverySummary() : Types.DeliverySummary {
    { dineInQueue = 5; onlineOrders = 7; delivering = 3 };
  };

  /// Returns the restaurant settings.
  public func getSettings(settings : { var value : Types.Settings }) : Types.Settings {
    settings.value;
  };

  /// Updates the restaurant settings and returns them.
  public func updateSettings(settings : { var value : Types.Settings }, input : Types.SettingsUpdate) : Types.Settings {
    let updated : Types.Settings = {
      restaurantName = input.restaurantName;
      openTime = input.openTime;
      closeTime = input.closeTime;
      averagePrepMinutes = input.averagePrepMinutes;
    };
    settings.value := updated;
    updated;
  };

  /// Returns the monthly subscription package details.
  public func getPackageInfo() : Types.PackageInfo {
    {
      pricePerMonth = 99000;
      badge = "คุ้มค่า!";
      trialLabel = "ใช้ฟรี 7 วัน";
      features = [
        "ตารางออเดอร์สดและคิวหน้าร้าน",
        "ติดตามไรเดอร์แบบเรียลไทม์",
        "AI แนะนำเมนูและโปรโมชัน",
        "รายงานยอดขายและกำไร",
        "จัดการเมนูและสต็อกวัตถุดิบ",
      ];
    };
  };
};
