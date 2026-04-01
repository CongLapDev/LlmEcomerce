package com.nhs.individual.zalopay.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nhs.individual.utils.Mapable;
import com.nhs.individual.zalopay.crypto.HMACUtil;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@Slf4j
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@ToString
public class OrderInfo implements Mapable {
    private static final String SANDBOX_KEY1 = "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn";
    //(REQUIRED) Định danh cho ứng dụng đã được cấp khi đăng ký ứng dụng với ZaloPay
    private int app_id;
    //(REQUIRED) Định danh user (Tên , id,..., có thể dùng thông tin mặc định, chằng hạn như tên ứng dụng )
    private String app_user;
    //(REQUIRED) Mã giao dịch phải bắt đầu theo format yymmdd của ngày hiện tại (Timezone VN) và nên theo format yymmddMã đơn hàng thanh toán
    private String app_trans_id;
    //(REQUIRED) Thời gian tạo đơn hàng (milisecond) không quá 15P so với thời điểm thanh toán
    private Long app_time;
    //Thời gian hết hạn của đơn hàng. Thời gian tính bằng giây (giá trị nhỏ nhất: 300, giá trị lớn nhất: 2592000)
    private Long expire_duration_seconds;

    //(REQUIRED)
    private Long amount;

    //(REQUIRED)Item  hàng (tự định nghĩa )
    private String item;

    // (REQUIRED)(Description)
    private String description;

    //Json string Dữ liệu riêng của đơn hàng. Dữ liệu này sẽ được callback lại cho AppServer khi thanh toán thành công (Nếu không có thì để chuỗi rỗng)
    private String embed_data;

    //(REQUIRED) * Mã ngân hàng
    private String bank_code;

    //(REQUIRED)mac Thông tin chứng thực của đơn hàng
    private String mac;

    private String callback_url;

    private String device_info;

    //Ch app dụng với đôối tác dđặc biêệt
    private String sub_app_id;

    private String title;
    private String currency;
    private String phone;
    private String email;
    private String address;

    public OrderInfo(int app_id, String app_user, String app_trans_id,Long amount, String description, String bank_code, String item, String embed_data, String key1, String callback_url, String title) {
        this.expire_duration_seconds= 900L;
        this.app_id = app_id;
        this.app_user = app_user;
        // app_trans_id must be passed fully formatted from service layer (yyMMdd_orderId_timestamp)
        this.app_trans_id = app_trans_id;
        // app_time set only once
        this.app_time = System.currentTimeMillis();
        this.amount = amount;
        this.description = description;
        this.bank_code=bank_code;
        this.item = item;
        this.embed_data = embed_data;
        this.callback_url = callback_url;
        this.title = title;
        
        // Generate MAC according to ZaloPay spec: app_id|app_trans_id|app_user|amount|app_time|embed_data|item
        String hmacInput = buildHmacInput();
        log.debug("========== ZaloPay MAC Generation ==========");
        log.debug("  HMAC Input: {}", hmacInput);

        if (key1 == null || key1.trim().isEmpty()) {
            log.error("❌ CRITICAL: key1 is null or empty! Cannot generate MAC.");
            throw new IllegalArgumentException("ZaloPay key1 cannot be null or empty");
        }

        String normalizedKey1 = key1.trim();
        log.debug("  Key1 length: {}", key1.length());
        log.debug("  Key1 trimmed length: {}", normalizedKey1.length());
        log.debug("  Key1 prefix: {}...", maskKey(normalizedKey1));

        if (!SANDBOX_KEY1.equals(normalizedKey1)) {
            log.warn("⚠️ WARNING: key1 does not match the default sandbox key '{}'.", maskKey(SANDBOX_KEY1));
            log.warn("  If you are using a custom sandbox application, this is expected.");
        }

        this.mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, normalizedKey1, hmacInput);
        String verifiedMac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, normalizedKey1, buildHmacInput());

        if (!this.mac.equals(verifiedMac)) {
            log.error("❌ CRITICAL: MAC verification failed inside OrderInfo.");
            log.error("  mac1: {}", this.mac);
            log.error("  mac2: {}", verifiedMac);
            throw new IllegalStateException("ZaloPay MAC verification failed");
        }

        log.debug("  Generated MAC (first 20 chars): {}...", this.mac != null && this.mac.length() > 20 ? this.mac.substring(0, 20) : this.mac);
        log.debug("===========================================");
    }

    public String getHmacInput() {
        return buildHmacInput();
    }

    private String buildHmacInput() {
        return this.app_id + "|" + this.app_trans_id + "|" + this.app_user + "|" + this.amount + "|" + this.app_time + "|" + this.embed_data + "|" + this.item;
    }

    private String maskKey(String key) {
        if (key == null || key.isEmpty()) {
            return "";
        }
        int visible = Math.min(10, key.length());
        return key.substring(0, visible);
    }

}
