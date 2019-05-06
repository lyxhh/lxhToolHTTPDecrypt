package burp;

import com.alibaba.fastjson.JSONObject;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.Base64;
import java.util.Locale;

public class test {

    public static void main(String[] args) throws Exception {
        String postUrl = "http://127.0.0.1:5000/call";
        StringBuffer paramsBuffer = new StringBuffer();
        StringBuffer dictBuffer = new StringBuffer();
        paramsBuffer.append("methodtag=");
        String methodtag = "bf715042a22842917912848a91a54452001";
        String hashname = "HasH";

        String s1 = hashname.toLowerCase();
        System.out.println(s1);

        if (hashname.equals("SHA1") || hashname.equals("SHA-224") || hashname.equals("SHA-256") || hashname.equals("SHA-384") || hashname.equals("SHA-512")) {
            String s = HashUtil.getsha(methodtag, hashname);
            System.out.println(hashname +":"+ s);
        }





        paramsBuffer.append(methodtag);
        JSONObject data = new JSONObject();
//                new HashMap();
        data.put("0","AaemW5ALVJo0%2BVpyBi7bLsF41c74Hw3T2FpVujki8%2F%2F1E7zo%2BMNTleXO%2FEK3+JAo55863xJmWoRgKxOax%2F2jlJUGQJu246bXf9PCoeTN66B7ZT44qwUSBci2x+7RvwqqjN1Rmg8ZA0IjdT%2FmsbSfOpnQ0ljjGhx4kq87u0BIMrwkNS37OfsCFZ+u%2BySsgyl%2Fcyz%2BH7ZD8koG2bzfKI56BX1fSVMG3ky3pRA5h%2FUFjpDZ5KtHvNX+DqIz2HxvJXb6LIUGQ2sjOufXpWygmrMCCvV1TRx6ahPC27Bh2rml9SKvM2jG+9XaAmfmpv8gvFICz5cfwChSBFdPJ18VgutJkGkpuFGvxMNyTLpu2PVYY8phL+ZBpDgbe%2BpuIdx2boVj4AZeNV7XI6qwDp0h6Pe2OnflTGdgxmvu3aZio5W6wc+jrus73byi9VqCNUjpk0o%2BlRIuFcjSJ6MbmRVUCbpuu5A76kp0GAQgeVcD3ee+OVZJTEtkq9HqXloHVFm3iJsbIAfi6u0pwXSOuQEkrQCxQ29ZMAfepfHddmvY+rRLwJNW9Qhxe2gUzPE2IhJDqPTQXdsfeOxSQODtcDP76XmxqvZ5TYUXD58s7+08R8f%2F%2BGfMfojyQjCvitoXsTid%2BBW7BvnVRDZGeifIBSBdyLXI4D1QhDOviz+r%2FM%2FBY3QNk2IcW1WYBpTLn%2F3hNoncvT8afaoY4szwl2zNUr7j9wGs6Ktu53G+8lCgtjRxDtheePOxmlLNhc%2FzTCpUuK02RnXM88sfp7c3gjMpHlB%2FOr%2Faxz%2FN+shW0xKVP%2F96CHV5rLL%2BBONBIcldz2nXdi%2FqGI28eUJgdWeV1buzWRb0ClS7J+oHpQgdV8%2B%2Bm%2B3ouwKgvlLq411a%2B%2BfdKnoAGv6GR27sszTz1enZiHc6iJH9iw+eOKBx6jPHMCjIocXZ5RckmkVEPP5mRjXTt2N93qLocAdAcIOnDaY4TCmXBlf+QEmPfspy51TiEuj9SWiBpk1GZ6VCYCi%2BGuV5ChDqG7sYVgAq1%2Bnsjdixi5Ad+XaWvvWOzrM3FwLjNdoev3vsREIPMo3XqSUJ1qW3izIHtS3sc%2FCW%2BOOZWCDtp+qcT8gljTTpf21s%2FxfoACCsUSrxpiolS1ACE%2BTWY6NFmSkhi9A1NkRPaGDFwj+N2MoNvGPHXjSIfWXNCjI8YvSyuu5e06zfK2VEKD3BNjT%2FEK1jVYMSzqk127W+DfeEaURN8AWGV%2BU6KdCwYkPEaK2UU%2FX6K%2BKKD%2Fkjnaj2bMN00ZEMhYYJMl1c+aEi7x6c8O50hKBLJKgAzCNUQA6ygqNyAA3AEKjl6JjtBRVJnGLqrcXgK7uGq+hqiqD1tdwYpZAtHnGxZfU5LGA5kMlS4%2F%2FmFlnSvF5jOJhz8SQs3cqxDu0wyA+sd%2B%2BotzJlhXqxowNqvMz%2F%2F01Q4EUXSEsceVq9k6l2mLRhueRpIT3lcLr2%2FXx+HaVpfMrRpLU%3D");
//        dictBuffer.append("{");
//        dictBuffer.append("\"0\":");
//        dictBuffer.append("\"");
//        dictBuffer.append("AaemW5ALVJo0%2BVpyBi7bLsF41c74Hw3T2FpVujki8%2F%2F1E7zo%2BMNTleXO%2FEK3+JAo55863xJmWoRgKxOax%2F2jlJUGQJu246bXf9PCoeTN66B7ZT44qwUSBci2x+7RvwqqjN1Rmg8ZA0IjdT%2FmsbSfOpnQ0ljjGhx4kq87u0BIMrwkNS37OfsCFZ+u%2BySsgyl%2Fcyz%2BH7ZD8koG2bzfKI56BX1fSVMG3ky3pRA5h%2FUFjpDZ5KtHvNX+DqIz2HxvJXb6LIUGQ2sjOufXpWygmrMCCvV1TRx6ahPC27Bh2rml9SKvM2jG+9XaAmfmpv8gvFICz5cfwChSBFdPJ18VgutJkGkpuFGvxMNyTLpu2PVYY8phL+ZBpDgbe%2BpuIdx2boVj4AZeNV7XI6qwDp0h6Pe2OnflTGdgxmvu3aZio5W6wc+jrus73byi9VqCNUjpk0o%2BlRIuFcjSJ6MbmRVUCbpuu5A76kp0GAQgeVcD3ee+OVZJTEtkq9HqXloHVFm3iJsbIAfi6u0pwXSOuQEkrQCxQ29ZMAfepfHddmvY+rRLwJNW9Qhxe2gUzPE2IhJDqPTQXdsfeOxSQODtcDP76XmxqvZ5TYUXD58s7+08R8f%2F%2BGfMfojyQjCvitoXsTid%2BBW7BvnVRDZGeifIBSBdyLXI4D1QhDOviz+r%2FM%2FBY3QNk2IcW1WYBpTLn%2F3hNoncvT8afaoY4szwl2zNUr7j9wGs6Ktu53G+8lCgtjRxDtheePOxmlLNhc%2FzTCpUuK02RnXM88sfp7c3gjMpHlB%2FOr%2Faxz%2FN+shW0xKVP%2F96CHV5rLL%2BBONBIcldz2nXdi%2FqGI28eUJgdWeV1buzWRb0ClS7J+oHpQgdV8%2B%2Bm%2B3ouwKgvlLq411a%2B%2BfdKnoAGv6GR27sszTz1enZiHc6iJH9iw+eOKBx6jPHMCjIocXZ5RckmkVEPP5mRjXTt2N93qLocAdAcIOnDaY4TCmXBlf+QEmPfspy51TiEuj9SWiBpk1GZ6VCYCi%2BGuV5ChDqG7sYVgAq1%2Bnsjdixi5Ad+XaWvvWOzrM3FwLjNdoev3vsREIPMo3XqSUJ1qW3izIHtS3sc%2FCW%2BOOZWCDtp+qcT8gljTTpf21s%2FxfoACCsUSrxpiolS1ACE%2BTWY6NFmSkhi9A1NkRPaGDFwj+N2MoNvGPHXjSIfWXNCjI8YvSyuu5e06zfK2VEKD3BNjT%2FEK1jVYMSzqk127W+DfeEaURN8AWGV%2BU6KdCwYkPEaK2UU%2FX6K%2BKKD%2Fkjnaj2bMN00ZEMhYYJMl1c+aEi7x6c8O50hKBLJKgAzCNUQA6ygqNyAA3AEKjl6JjtBRVJnGLqrcXgK7uGq+hqiqD1tdwYpZAtHnGxZfU5LGA5kMlS4%2F%2FmFlnSvF5jOJhz8SQs3cqxDu0wyA+sd%2B%2BotzJlhXqxowNqvMz%2F%2F01Q4EUXSEsceVq9k6l2mLRhueRpIT3lcLr2%2FXx+HaVpfMrRpLU%3D");
//        dictBuffer.append("\"");
//        dictBuffer.append("}");

        paramsBuffer.append("&argsinfo=");
        System.out.println(data.toJSONString());
//        System.out.println(data.toJSONString());

//        paramsBuffer.append(data.toString());
        paramsBuffer.append(URLEncoder.encode(data.toString(),"UTF-8"));
//        paramsBuffer.append("&argsinfo=");



//        paramsBuffer.append("%7b%220%22%3a%22AaemW5ALVJo3BHG5VQQ33T8SLm1wy8APJsiE1T1KrfzuktEuW1YALQBR%252BvsSNXQ%252BpbqZw8liO02Y4bXqPP2Ui6XudzXh79VtXMmto%252FMdHdjZQPkR77827c2vWT0LSI%252B1ddmuwF7kRKSHWvs6bIzxf2kQJ5LAq854ljatdIaSl95AhsgCa48ghC1T3%252BX%252F6AxfxttxO3xLBVTH6Rgn91w4PXU1Q0itH8p7TNWpHAvRastRVAVk7y4s8GwGtG5U6XgYX%252BRhgmsqFJoIsuVBhgYun1q5doMGZRcv6jHJ8IQjMHREidZ5FDu3LzhGo2z3OQlXlcZ778ufwbrJwdkZLC9EwXcTMEPf1HrpR8wkWCZe%252FizfRFeKKoYeUTAzoSC74UR1Ov%252F60%252FYY8HXfpRF6imk8O%252FgGfGIfrKLxeez55sTOu%252BexbFAB6Rp6xjZUPrAWIPEDF2s3i%252Bkq%252FzsIODOsbWLO5EXeZ5mUGAfL3nDQUPr27R2gcrAkX7eWusBtNJHOohP%252BYTUsvfmsKit71UcqhRBiua4pizG9uRNgiRQxws%252BSEzXpz6y5W%252BtTogN4FjqDduV70JFVSERXLzNVwf%252B2mAOS54nl1TzD1hiuiOCZN0FzfO5l3GMsyAkwgw%253D%253D%22%7d");
//        paramsBuffer.append("{");
//        paramsBuffer.append("\"0\":");
//        paramsBuffer.append("\"");
//        paramsBuffer.append("AaemW5ALVJo0%2BVpyBi7bLsF41c74Hw3T2FpVujki8%2F%2F1E7zo%2BMNTleXO%2FEK3+JAo55863xJmWoRgKxOax%2F2jlJUGQJu246bXf9PCoeTN66B7ZT44qwUSBci2x+7RvwqqjN1Rmg8ZA0IjdT%2FmsbSfOpnQ0ljjGhx4kq87u0BIMrwkNS37OfsCFZ+u%2BySsgyl%2Fcyz%2BH7ZD8koG2bzfKI56BX1fSVMG3ky3pRA5h%2FUFjpDZ5KtHvNX+DqIz2HxvJXb6LIUGQ2sjOufXpWygmrMCCvV1TRx6ahPC27Bh2rml9SKvM2jG+9XaAmfmpv8gvFICz5cfwChSBFdPJ18VgutJkGkpuFGvxMNyTLpu2PVYY8phL+ZBpDgbe%2BpuIdx2boVj4AZeNV7XI6qwDp0h6Pe2OnflTGdgxmvu3aZio5W6wc+jrus73byi9VqCNUjpk0o%2BlRIuFcjSJ6MbmRVUCbpuu5A76kp0GAQgeVcD3ee+OVZJTEtkq9HqXloHVFm3iJsbIAfi6u0pwXSOuQEkrQCxQ29ZMAfepfHddmvY+rRLwJNW9Qhxe2gUzPE2IhJDqPTQXdsfeOxSQODtcDP76XmxqvZ5TYUXD58s7+08R8f%2F%2BGfMfojyQjCvitoXsTid%2BBW7BvnVRDZGeifIBSBdyLXI4D1QhDOviz+r%2FM%2FBY3QNk2IcW1WYBpTLn%2F3hNoncvT8afaoY4szwl2zNUr7j9wGs6Ktu53G+8lCgtjRxDtheePOxmlLNhc%2FzTCpUuK02RnXM88sfp7c3gjMpHlB%2FOr%2Faxz%2FN+shW0xKVP%2F96CHV5rLL%2BBONBIcldz2nXdi%2FqGI28eUJgdWeV1buzWRb0ClS7J+oHpQgdV8%2B%2Bm%2B3ouwKgvlLq411a%2B%2BfdKnoAGv6GR27sszTz1enZiHc6iJH9iw+eOKBx6jPHMCjIocXZ5RckmkVEPP5mRjXTt2N93qLocAdAcIOnDaY4TCmXBlf+QEmPfspy51TiEuj9SWiBpk1GZ6VCYCi%2BGuV5ChDqG7sYVgAq1%2Bnsjdixi5Ad+XaWvvWOzrM3FwLjNdoev3vsREIPMo3XqSUJ1qW3izIHtS3sc%2FCW%2BOOZWCDtp+qcT8gljTTpf21s%2FxfoACCsUSrxpiolS1ACE%2BTWY6NFmSkhi9A1NkRPaGDFwj+N2MoNvGPHXjSIfWXNCjI8YvSyuu5e06zfK2VEKD3BNjT%2FEK1jVYMSzqk127W+DfeEaURN8AWGV%2BU6KdCwYkPEaK2UU%2FX6K%2BKKD%2Fkjnaj2bMN00ZEMhYYJMl1c+aEi7x6c8O50hKBLJKgAzCNUQA6ygqNyAA3AEKjl6JjtBRVJnGLqrcXgK7uGq+hqiqD1tdwYpZAtHnGxZfU5LGA5kMlS4%2F%2FmFlnSvF5jOJhz8SQs3cqxDu0wyA+sd%2B%2BotzJlhXqxowNqvMz%2F%2F01Q4EUXSEsceVq9k6l2mLRhueRpIT3lcLr2%2FXx+HaVpfMrRpLU%3D");
//        paramsBuffer.append("\"");
//        paramsBuffer.append("}");
//        this.stdout.println(paramsBuffer.toString());
        System.out.println(paramsBuffer);
//        String response = sendPost(postUrl, paramsBuffer.toString());
//        System.out.println(response);
//        this.stdout.println(response);
//        Map<String, String> data = new HashMap<String, String>();
//        JSONObject data = new JSONObject();
//        data.put("0","abc");
//        data.put("1","12q11aasd98bbbbbbqaa3");
//        data.put("2", true);
//        data.put("3",'a');
//        data.put("4","[96,97,97,97,97,98,99]");
//
////        data.put("methodtag", "test3e64d48392a81b662ed251339f0f0f06a05");
////        data.put("argsinfo", "{\"0\":\"abc\",\"1\":666,\"2\":true,\"3\":\"a\",\"4\":[97,97,97,97,98,99]}");
//        System.out.println(data.toString());
//        String code = HttpRequest.post("http://127.0.0.1:5000/call").send("methodtag=test3e64d48392a81b662ed251339f0f0f06a05&&argsinfo="+data.toString()).body();
//        System.out.println(code);
//        StringBuffer paramsBuffer = new StringBuffer();
////        paramsBuffer.append(methodtag);
//        paramsBuffer.append("&argsinfo=");
//        paramsBuffer.append("{");
//        paramsBuffer.append("\"0\":");
//        paramsBuffer.append("\"");
//        paramsBuffer.append("abc");
//        paramsBuffer.append("\"");
//        paramsBuffer.append("}");
//        JSONObject data = new JSONObject();
//        data.put("0","abc");
//        data.put("1","12q11aasd98bbbbbbqaa3");
//        System.out.println(data);
//        System.out.println(paramsBuffer.toString());
//        paramsBuffer.append(data.toString());
//        String postUrl = "http://127.0.0.1:5000/call";
//        StringBuffer paramsBuffer = new StringBuffer();
//        paramsBuffer.append("methodtag=");
//        //使用URLEncoder.encode对特殊和不可见字符进行编码
//        String methodtag = "test1e64d48392a81b662ed251339f0f0f06a02";
//        paramsBuffer.append(methodtag);
//        paramsBuffer.append("&argsinfo=");
//
//        String response = sendPost(postUrl, paramsBuffer.toString());
//        System.out.println(response);
    }

//    public static String sendPost(String url, String param) {
//        PrintWriter out = null;
//        BufferedReader in = null;
//        String line = "";
//        String result = "";
//        try {
//            URL realUrl = new URL(url);
//
//            URLConnection conn = realUrl.openConnection();// open url
//            // Set HTTPHeader
////            conn.setRequestProperty("accept", "*/*");
//            conn.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
////            System.out.println(conn.getContentType());
//            // POST Method never
//            conn.setDoOutput(true);
//            conn.setDoInput(true);
//
//            out = new PrintWriter(conn.getOutputStream()); // Get URLConnection PrintWriter
//
//            out.print(param); // POST Args
//            out.flush();
//
//            // Define BufferedReader read Response
//            in = new BufferedReader(new InputStreamReader(conn.getInputStream(),"utf-8"));
//
//            while ((line = in.readLine()) != null) {
//                result += line;
//            }
//        } catch (Exception e) {
//            System.out.println("发送 POST 请求出现异常！"+e);
//            e.printStackTrace();
//        } // close
//        finally{
//            try{
//                if(out!=null){
//                    out.close();
//                }
//                if(in!=null){
//                    in.close();
//                }
//            }
//            catch(IOException ex){
//                ex.printStackTrace();
//            }
//        }
//        return result;
//    }

}
