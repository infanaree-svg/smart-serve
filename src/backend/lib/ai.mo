import { fromEnv } "mo:caffeineai-inference-client/Config";
import ChatApi "mo:caffeineai-inference-client/Apis/ChatApi";
import ChatCompletionRequest "mo:caffeineai-inference-client/Models/ChatCompletionRequest";
import ChatCompletionRequestMessageOneOf2 "mo:caffeineai-inference-client/Models/ChatCompletionRequestMessageOneOf2";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Types "../types/ai";

module {
  /// Generates a fresh daily recommendation from sales and customer behaviour.
  public func generateRecommendation<system>() : async* Types.DailyRecommendation {
    let prompt = "คุณเป็นผู้ช่วยวิเคราะห์ร้านอาหารไทย ชื่อร้าน ครัวคุณอ้วย " #
      "จากข้อมูลยอดขายวันนี้ ฿4,820 กำไร ฿1,450 ออเดอร์ 38 รายการ เวลารอเฉลี่ย 12 นาที " #
      "เมนูขายดีใน 7 วันนี้คือ ข้าวกะเพรา ราดหน้าหมูสับ และผัดกะเพราไข่ดาว " #
      "ให้คำแนะนำ 2 ข้อสั้น ๆ เป็นภาษาไทย แต่ละข้อมีหัวข้อและรายละเอียด " #
      "ตอบบรรทัดละข้อ โดยขึ้นต้นด้วย 'หัวข้อ: ' แล้วตามด้วยรายละเอียด";

    let items = try {
      let config = fromEnv<system>();
      let userMessage = ChatCompletionRequestMessageOneOf2.JSON.init({
        content = #string(prompt);
        role = #user;
      });
      let req = ChatCompletionRequest.JSON.init({
        messages = [#user(userMessage)];
        model = "router";
      });
      let resp = await* ChatApi.createChatCompletion(config, req);
      if (resp.choices.size() == 0) {
        Runtime.trap("Inference returned no choices");
      };
      let text = resp.choices[0].message.content
        ?? Runtime.trap("Inference returned no text content");
      parseItems(text);
    } catch (_) {
      fallbackItems();
    };

    { generatedAt = Int.abs(Time.now()); items };
  };

  /// Splits the model's reply into recommendation cards.
  func parseItems(text : Text) : [Types.Recommendation] {
    let lines = text.split(#char '\n').filter(
      func(line) { line.trim(#predicate(func(c) { c == ' ' or c == '\t' or c == '\r' })).size() > 0 }
    ).toArray();
    let items = lines.map(
      func(line) {
        let trimmed = line.trim(#predicate(func(c) { c == ' ' or c == '\t' or c == '\r' or c == '-' or c == '*' or c == '•' }));
        let parts = trimmed.split(#char ':').toArray();
        switch (parts.size()) {
          case (0) { { title = "คำแนะนำ"; detail = trimmed } };
          case (1) { { title = "คำแนะนำ"; detail = trimmed } };
          case (_) {
            let title = parts[0].trim(#predicate(func(c) { c == ' ' }));
            let rest = parts.sliceToArray(1, parts.size().toInt());
            { title; detail = rest.values().join(":").trim(#predicate(func(c) { c == ' ' })) };
          };
        };
      }
    );
    if (items.size() == 0) { fallbackItems() } else { items };
  };

  /// Sensible static recommendations used when inference is unavailable.
  func fallbackItems() : [Types.Recommendation] {
    [
      {
        title = "จัดเซ็ตข้าว + เครื่องดื่ม";
        detail = "เมนูขายดีใน 7 วันนี้ เพิ่มยอดขายได้อีก 25%";
      },
      {
        title = "วัตถุดิบใกล้หมดอายุ";
        detail = "ผัดกะเพรา/ไข่ ไก่ ควรใช้ภายใน 2 วัน";
      },
    ];
  };
};
