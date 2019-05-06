package burp;

import java.util.Base64;
import java.util.Locale;

public class EncodeUtil {
    //大写
//    {"To lower case","To upper case", "Base64-encode"});

    public static String Encode(String Encodename, String EncodeData) {
        if (Encodename.equals("To lower case")) {
            return EncodeData.toLowerCase(Locale.ENGLISH);
        } else if (Encodename.equals("To upper case")) {
            return EncodeData.toUpperCase(Locale.ENGLISH);
        } else if (Encodename.equals("Base64-encode")) {
            return Base64.getEncoder().encodeToString(EncodeData.getBytes());
        }
        return "Unknown encoding,please check...";
    }

}
