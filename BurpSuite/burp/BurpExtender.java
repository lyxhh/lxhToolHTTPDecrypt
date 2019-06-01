package burp;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.ArrayUtils;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.*;
import java.net.URLEncoder;
import java.util.*;
import java.util.List;


public class BurpExtender implements IBurpExtender, IHttpListener, IContextMenuFactory, ActionListener, IMessageEditorTabFactory, ITab {
    private IBurpExtenderCallbacks callbacks;
    private IExtensionHelpers helpers;
    private PrintWriter stdout;
    private PrintWriter Stderr;
    private IContextMenuInvocation currentInvocation;
    private JTextField url;

    private JPanel jPanel;
    private JTextField bContextCustomText1;
    private JTextField bContextCustomText2;
    private JTextField bContextCustomText3;
    private JTextField bContextCustomText4;
    private JTextField Text;  //add Parameter TextField
    private JTextField methodtag;

    private JComboBox Selectbox;
    private JComboBox HASHSelectbox;
    private JComboBox Encodebox;

    private JTextArea ParameterText;
    private JTextArea SignParametertext;

    private JTextArea RequestsText;
    private JTextArea ResponseText;


    private JCheckBox jCheckBox;
    private final List<String> method = Arrays.asList(new String[]{"String", "GET", "POST", "COOKIE", "Body", "HEADER"});
    private final List<String> HashEncrypt = Arrays.asList(new String[]{"16md5", "32md5", "SHA1", "SHA-224", "SHA-256", "SHA-384", "SHA-512", "methodtag"});
    private final List<String> EncodeList = Arrays.asList(new String[]{"None", "To lower case", "To upper case", "Base64-encode"});


    //
    private String postUrl;

    @Override
    public void registerExtenderCallbacks(IBurpExtenderCallbacks callbacks) {
        this.postUrl = "http://127.0.0.1:8088/";
        this.callbacks = callbacks;
        this.helpers = callbacks.getHelpers();
        this.stdout = new PrintWriter(callbacks.getStdout(), true);
        this.Stderr = new PrintWriter(callbacks.getStderr(), true);

//        this.stdout.println("The Ultimate Xi4oH4oD3crypt0r!");
        callbacks.setExtensionName("HTTP Decrypt");

        callbacks.registerContextMenuFactory(this);
        callbacks.registerHttpListener(this);
        callbacks.registerMessageEditorTabFactory(this);

        this.jPanel = new JPanel(null);

        JLabel UrlLabel = new JLabel();
        JLabel bContextCustomLabel = new JLabel();
        JLabel bContextCustomLabe2 = new JLabel();
        JLabel bContextCustomLabe3 = new JLabel();
        JLabel bContextCustomLabe4 = new JLabel();

        JLabel HServerurlDescLabel = new JLabel();
        HServerurlDescLabel.setText("Set HTTPServer Url.");
        HServerurlDescLabel.setBounds(236 + 330 + 20 + 60 + 10 + 170, 16, 300, 20);

        JLabel CustomfunctionRequestDescLabel = new JLabel();
        CustomfunctionRequestDescLabel.setText("Set method(encrypt) in the request.");
        CustomfunctionRequestDescLabel.setBounds(236 + 330 + 20 + 60 + 10 + 170+136+230, 9 + 40+11, 560, 20);

        JLabel Customfunction1RequestDescLabel = new JLabel();
        Customfunction1RequestDescLabel.setText("Set method(decrypt) in the request.");
        Customfunction1RequestDescLabel.setBounds(236 + 330 + 20 + 60 + 10 + 170+136+230, 47 + 35+11, 560, 20);

        JLabel CustomfunctionResponseDescLabel = new JLabel();
        CustomfunctionResponseDescLabel.setText("Set method(encrypt) in the response.");
        CustomfunctionResponseDescLabel.setBounds(236 + 330 + 20 + 60 + 10 + 170+136+230, 17 + 100+11, 560, 20);

        JLabel Customfunction1ResponseDescLabel = new JLabel();
        Customfunction1ResponseDescLabel.setText("Set method(decrypt) in the response.");
        Customfunction1ResponseDescLabel.setBounds(236 + 330 + 20 + 60 + 10 + 170+136+230, 17 + 100+35+11, 560, 20);

//        JLabel CustomfunctionResponseDescLabel = new JLabel();

        jCheckBox = new JCheckBox("Auto");

        BurpExtender.this.url = new JTextField();

        this.bContextCustomText1 = new JTextField();
        this.bContextCustomText2 = new JTextField();
        this.bContextCustomText3 = new JTextField();
        this.bContextCustomText4 = new JTextField();

        ParameterText = new JTextArea(10, 33);
        ParameterText.setLineWrap(true);    // set auto line
        Dimension size = ParameterText.getPreferredSize();
        JScrollPane jsp = new JScrollPane(ParameterText);
        jsp.setBounds(16, 117 + 26 + 35+11, size.width, size.height);

        SignParametertext = new JTextArea(10, 33);
        SignParametertext.setLineWrap(true);    // set auto line
        Dimension Signtextsize = SignParametertext.getPreferredSize();
        JScrollPane Signtextjsp = new JScrollPane(SignParametertext);
        Signtextjsp.setBounds(20 + 6 + size.width + 155 + 40 + 175 + 40, 117 + 26 + 35+11, Signtextsize.width, Signtextsize.height);

        RequestsText = new JTextArea(3, 53);
        RequestsText.setLineWrap(true);    // set auto line
        RequestsText.setText("{\"0\":\"019CE961992BA5AB\"}");
        Dimension RequestsTextsize = RequestsText.getPreferredSize();
        JScrollPane RequestsTextsizejsp = new JScrollPane(RequestsText);
        RequestsTextsizejsp.setBounds(236 + 330 + 20, 5 + 40, RequestsTextsize.width, RequestsTextsize.height);

        ResponseText = new JTextArea(3, 53);
        ResponseText.setLineWrap(true);    // set auto line
        ResponseText.setText("{\"0\":\"019CE961992BA5AB\"}");
        Dimension ResponseTextsize = ResponseText.getPreferredSize();
        JScrollPane ResponseTextsizejsp = new JScrollPane(ResponseText);
        ResponseTextsizejsp.setBounds(236 + 330 + 20, 17 + 100, ResponseTextsize.width, ResponseTextsize.height);


        Text = new JTextField();
        Text.setBounds(20 + 16 + size.width + 155 + 20, 117 + 26 + 35 + 38 + 40 + 28 + 10 + 40+11, 175 + 50, 28);

        methodtag = new JTextField();
        methodtag.setEditable(false);
        methodtag.setBackground(new Color(232, 232, 232));
        methodtag.setBounds(20 + 16 + size.width + 155 + 20, 117 + 26 + 35 + 28+11, 175 + 50, 28);

        JButton Add = new JButton("Add Parameters");
        Add.setBounds(10 + 16 + size.width, 117 + 26 + 35 + 80 + 110+11, 175, 20);
        Add.setActionCommand("ParameterContext");
        Add.addActionListener(this);

        JButton confirm = new JButton("Add SignParameters");
        confirm.setBounds(20 + 16 + size.width + 155 + 20, 117 + 26 + 35 + 80 + 110+11, 175 + 50, 20);
        confirm.setActionCommand("SignParameterContext");
        confirm.addActionListener(this);


        JLabel HashDescLabel = new JLabel();
        HashDescLabel.setText("Select Encryption Algorithm.");
        HashDescLabel.setBounds(10 + 16 + size.width, 117 + 26 + 35+11, 200, 28);

        HASHSelectbox = new JComboBox(this.HashEncrypt.toArray());
        HASHSelectbox.setBounds(10 + 16 + size.width, 117 + 26 + 35 + 28+11, 175, 28);
        HASHSelectbox.setSelectedIndex(0);
        HASHSelectbox.setActionCommand("HASHSelectbox");
        HASHSelectbox.addActionListener(this);


        JLabel AddEncodeDescLabel = new JLabel();
        AddEncodeDescLabel.setText("Select Encode information.");
        AddEncodeDescLabel.setBounds(10 + 16 + size.width, 117 + 26 + 35 + 38 + 20+11, 175, 28);

        Encodebox = new JComboBox(this.EncodeList.toArray());
        Encodebox.setBounds(10 + 16 + size.width, 117 + 26 + 35 + 38 + 40 + 10+11, 175, 28);
        Encodebox.setSelectedIndex(0);


        JLabel AddParameterDescLabel = new JLabel();
        AddParameterDescLabel.setText("Add Parameter information.");
        AddParameterDescLabel.setBounds(10 + 16 + size.width, 117 + 26 + 35 + 38 + 40 + 28 + 20+11, 175, 28);
        Selectbox = new JComboBox(this.method.toArray());
        Selectbox.setBounds(10 + 16 + size.width, 117 + 26 + 35 + 38 + 40 + 28 + 10 + 40+11, 175, 28);
        Selectbox.setSelectedIndex(0);

        UrlLabel.setText("Custom HTTPServer Url:");
        UrlLabel.setBounds(16, 15, 175, 20);
        BurpExtender.this.url.setText(this.postUrl);
        BurpExtender.this.url.setBounds(236, 12, 330, 28);

        jCheckBox.setBounds(236 + 330 + 20, 12, 60, 28);


        JButton jButton = new JButton("Set HServer Url");
        jButton.setBounds(236 + 330 + 20 + 60 + 10, 16, 160, 20);
        jButton.setActionCommand("SetHServerUrl");
        jButton.addActionListener(this);

        bContextCustomLabel.setText("Custom Request functions1:");
        bContextCustomLabel.setBounds(16, 15 + 30+10, 200, 20);
        this.bContextCustomText1.setBounds(236, 12 + 30+10, 330, 28);

        bContextCustomLabe2.setText("Custom Request functions2:");
        bContextCustomLabe2.setBounds(16, 50 + 30+10, 200, 20);
        this.bContextCustomText2.setBounds(236, 47 + 30+10, 330, 28);


        bContextCustomLabe3.setText("Custom Response functions3:");
        bContextCustomLabe3.setBounds(16, 85 + 30+11, 200, 20);
        this.bContextCustomText3.setBounds(236, 82 + 30+11, 330, 28);

        bContextCustomLabe4.setText("Custom Response functions4:");
        bContextCustomLabe4.setBounds(16, 120 + 30+11, 200, 20);
        this.bContextCustomText4.setBounds(236, 117 + 30+11, 330, 28);

        this.jPanel.add(UrlLabel);
        this.jPanel.add(this.url);

        this.jPanel.add(bContextCustomLabel);
        this.jPanel.add(this.bContextCustomText1);

        this.jPanel.add(bContextCustomLabe2);
        this.jPanel.add(this.bContextCustomText2);

        this.jPanel.add(bContextCustomLabe3);
        this.jPanel.add(this.bContextCustomText3);

        this.jPanel.add(bContextCustomLabe4);
        this.jPanel.add(this.bContextCustomText4);
        this.jPanel.add(Customfunction1ResponseDescLabel);
        this.jPanel.add(Customfunction1RequestDescLabel);
        this.jPanel.add(Encodebox);
        this.jPanel.add(AddEncodeDescLabel);
        this.jPanel.add(Add);

        this.jPanel.add(jsp);
        this.jPanel.add(Signtextjsp);
        this.jPanel.add(RequestsTextsizejsp);
        this.jPanel.add(ResponseTextsizejsp);

        this.jPanel.add(Selectbox);
        this.jPanel.add(HASHSelectbox);
        this.jPanel.add(Text);
        this.jPanel.add(methodtag);
        this.jPanel.add(confirm);
        this.jPanel.add(jCheckBox);
        this.jPanel.add(jButton);
        this.jPanel.add(HServerurlDescLabel);
        this.jPanel.add(CustomfunctionRequestDescLabel);
        this.jPanel.add(CustomfunctionResponseDescLabel);
        this.jPanel.add(HashDescLabel);
        this.jPanel.add(AddParameterDescLabel);

        this.callbacks.customizeUiComponent(this.jPanel);
        this.callbacks.addSuiteTab(BurpExtender.this);
    }

    @Override
    public List<JMenuItem> createMenuItems(IContextMenuInvocation invocation) {

        if (invocation.getInvocationContext() == IContextMenuInvocation.CONTEXT_MESSAGE_EDITOR_REQUEST ||
                invocation.getInvocationContext() == IContextMenuInvocation.CONTEXT_MESSAGE_EDITOR_RESPONSE) {

            this.currentInvocation = invocation;

            List<JMenuItem> listMenuItems = new ArrayList<JMenuItem>();
            JMenuItem jMenuItem1 = new JMenuItem("Custom Request functions1");
            jMenuItem1.setActionCommand("contextcustom1");
            jMenuItem1.addActionListener(this);

            JMenuItem jMenuItem2 = new JMenuItem("Custom Request functions2");
            jMenuItem2.setActionCommand("contextcustom2");
            jMenuItem2.addActionListener(this);

            listMenuItems.add(jMenuItem1);
            listMenuItems.add(jMenuItem2);

            return listMenuItems;
        } else if (invocation.getInvocationContext() == IContextMenuInvocation.CONTEXT_MESSAGE_VIEWER_REQUEST ||
                invocation.getInvocationContext() == IContextMenuInvocation.CONTEXT_MESSAGE_VIEWER_RESPONSE) {

            this.currentInvocation = invocation;

            List<JMenuItem> listMenuItems = new ArrayList<JMenuItem>();
            JMenuItem jMenuItem3 = new JMenuItem("Custom Response functions3");
            jMenuItem3.setActionCommand("contextcustom3");
            jMenuItem3.addActionListener(this);

            JMenuItem jMenuItem4 = new JMenuItem("Custom Response functions4");
            jMenuItem4.setActionCommand("contextcustom4");
            jMenuItem4.addActionListener(this);

            listMenuItems.add(jMenuItem3);
            listMenuItems.add(jMenuItem4);
            return listMenuItems;
        } else {
            return null;
        }
    }


    @Override
    public void actionPerformed(ActionEvent event) {
        String command = event.getActionCommand();
        String buildArgResult = "";
        String methodtag = "";
        String RequeststextArgs = "";

        if (command.equals("contextcustom1") || command.equals("contextcustom2")) {
            RequeststextArgs = (command.equals("contextcustom1")) ? RequestsText.getText().trim() : ResponseText.getText().trim();
            if (RequeststextArgs.equals("") || null == RequeststextArgs){
                BurpExtender.this.Stderr.println("RequeststextArgs is Null, please check Custom Request functions1 or 2...");
                return;
            }

            methodtag = (command.equals("contextcustom1")) ? this.bContextCustomText1.getText().trim() : this.bContextCustomText2.getText().trim();
            if (methodtag.equals("") || null == methodtag) {
                BurpExtender.this.Stderr.println("methodtag is Null, please check Custom Request functions1 or 2...");
                return;
            }

            IHttpRequestResponse[] selectedItems = this.currentInvocation.getSelectedMessages();
            int[] selectedBounds = this.currentInvocation.getSelectionBounds();
            byte selectedInvocationContext = this.currentInvocation.getInvocationContext();

            try {

                byte[] selectedRequestOrResponse = null;
                if (selectedInvocationContext == IContextMenuInvocation.CONTEXT_MESSAGE_EDITOR_REQUEST) {
                    selectedRequestOrResponse = selectedItems[0].getRequest();
                } else {
                    selectedRequestOrResponse = selectedItems[0].getResponse();
                }

                byte[] preSelectedPortion = Arrays.copyOfRange(selectedRequestOrResponse, 0, selectedBounds[0]);
                byte[] selectedPortion = Arrays.copyOfRange(selectedRequestOrResponse, selectedBounds[0], selectedBounds[1]);
                byte[] postSelectedPortion = Arrays.copyOfRange(selectedRequestOrResponse, selectedBounds[1], selectedRequestOrResponse.length);

                buildArgResult = this.buildArgMessage(methodtag, selectedPortion, RequeststextArgs);

                byte[] newRequest = ArrayUtils.addAll(preSelectedPortion, this.helpers.stringToBytes(Util.sendPost(BurpExtender.this.postUrl, buildArgResult)));
                newRequest = ArrayUtils.addAll(newRequest, postSelectedPortion);

                selectedItems[0].setRequest(newRequest);

            } catch (Exception e) {

                this.stdout.print("Exception with custom context application");

            }
        } else if (command.equals("contextcustom3") || command.equals("contextcustom4")) {
            RequeststextArgs = (command.equals("contextcustom3")) ? RequestsText.getText().trim() : ResponseText.getText().trim();
            if (RequeststextArgs.equals("") || null == RequeststextArgs){
                BurpExtender.this.Stderr.println("RequeststextArgs is Null, please check Custom Request functions3 or 4...");
                return;
            }
            methodtag = (command.equals("contextcustom3")) ? this.bContextCustomText3.getText().trim() : this.bContextCustomText4.getText().trim();
            if (methodtag.equals("") || null == methodtag) {
                BurpExtender.this.Stderr.println("methodtag is Null, please check Custom Response functions3 or 4...");
                return;
            }

            IHttpRequestResponse[] selectedItems = currentInvocation.getSelectedMessages();
            int[] selectedBounds = currentInvocation.getSelectionBounds();
            byte selectedInvocationContext = currentInvocation.getInvocationContext();

            try {

                byte[] selectedRequestOrResponse = null;
                if (selectedInvocationContext == IContextMenuInvocation.CONTEXT_MESSAGE_VIEWER_REQUEST) {
                    selectedRequestOrResponse = selectedItems[0].getRequest();
                } else {
                    selectedRequestOrResponse = selectedItems[0].getResponse();
                }

                byte[] selectedPortion = Arrays.copyOfRange(selectedRequestOrResponse, selectedBounds[0], selectedBounds[1]);
                buildArgResult = this.buildArgMessage(methodtag, selectedPortion, RequeststextArgs);

                String result = Util.sendPost(BurpExtender.this.postUrl, buildArgResult);
                SwingUtilities.invokeLater(new Runnable() {

                    @Override
                    public void run() {

                        JTextArea ta = new JTextArea(10, 30);
                        ta.setText(result);
                        ta.setWrapStyleWord(true);
                        ta.setLineWrap(true);
                        ta.setCaretPosition(0);
                        ta.setEditable(false);

                        JOptionPane.showMessageDialog(null, new JScrollPane(ta), "Custom invocation response", JOptionPane.INFORMATION_MESSAGE);

                    }

                });
            } catch (Exception e) {
                BurpExtender.this.stdout.print("Exception with custom context application");
            }
        } else if (command.equals("ParameterContext")) {
            StringBuffer dictBuffer = new StringBuffer();
            String textarea = this.ParameterText.getText();
            String text = this.Text.getText();
            String selectedItem = (String) this.Selectbox.getSelectedItem();

            dictBuffer.append("{");
            dictBuffer.append("\"");
            dictBuffer.append(selectedItem);
            dictBuffer.append("\":");
            dictBuffer.append("\"");
            dictBuffer.append(text);
            dictBuffer.append("\"");
            dictBuffer.append("}");

            if (null == textarea || textarea.equals("")) {
                this.ParameterText.setText(dictBuffer.toString());
            } else {
                this.ParameterText.setText(textarea + "\n" + dictBuffer.toString());
            }

        } else if (command.equals("SignParameterContext")) {
            StringBuffer dictBuffer = new StringBuffer();
            String textarea = this.SignParametertext.getText();
            String text = this.Text.getText();
            String selectedItem = (String) this.Selectbox.getSelectedItem();

            dictBuffer.append("{");
            dictBuffer.append("\"");
            dictBuffer.append(selectedItem);
            dictBuffer.append("\":");
            dictBuffer.append("\"");
            dictBuffer.append(text);
            dictBuffer.append("\"");
            dictBuffer.append("}");

            if (null == textarea || textarea.equals("")) {
                this.SignParametertext.setText(dictBuffer.toString());
            } else {
                this.SignParametertext.setText(textarea + "\n" + dictBuffer.toString());
            }
//            this.stdout.println(textarea);
        } else if (command.equals("HASHSelectbox")) {
//            BurpExtender.this.stdout.println("HASHSelectbox");
            if ("methodtag".equals((String) this.HASHSelectbox.getSelectedItem())) {
                BurpExtender.this.methodtag.setEditable(true);
                BurpExtender.this.methodtag.setBackground(new Color(255, 255, 255));
            } else {
                BurpExtender.this.methodtag.setEditable(false);
                BurpExtender.this.methodtag.setBackground(new Color(232, 232, 232));
            }
        } else if (command.equals("SetHServerUrl")) {
            BurpExtender.this.postUrl = BurpExtender.this.url.getText().trim();
            BurpExtender.this.stdout.println("HTTPServerUrl Change to " + BurpExtender.this.postUrl);
        }

    }

    public String buildArgMessage(String methodtag, byte[] BodyContentOrSelectContent, String TextArgs) throws UnsupportedEncodingException {
        StringBuffer paramsBuffer = new StringBuffer();

        paramsBuffer.append("methodtag=");
        paramsBuffer.append(BurpExtender.this.helpers.base64Encode(methodtag));

        paramsBuffer.append("&argsinfo=");

        String Argsinfo = TextArgs.replace("019CE961992BA5AB", "-H0T0TooP00Deocot0y0pr-" + BurpExtender.this.helpers.base64Encode(BodyContentOrSelectContent));

        paramsBuffer.append(URLEncoder.encode(Argsinfo, "UTF-8"));
//        this.stdout.println(paramsBuffer);
        return paramsBuffer.toString();
    }


    @Override
    public String getTabCaption() {
        return "HTTP Decrypt";
    }

    @Override
    public Component getUiComponent() {
        return this.jPanel;
    }

    @Override
    public void processHttpMessage(int toolFlag, boolean messageIsRequest, IHttpRequestResponse messageInfo) throws UnsupportedEncodingException {
        // TOOL_REPEATER     TOOL_SCANNER     TOOL_INTRUDER
        if (jCheckBox.isSelected()) {
            if (64 == toolFlag || 16 == toolFlag || 32 == toolFlag) {
                if (messageIsRequest) {
                    byte[] request = messageInfo.getRequest();
                    IRequestInfo analyzeRequest = this.helpers.analyzeRequest(request);

                    byte[] body = Arrays.copyOfRange(request, analyzeRequest.getBodyOffset(), request.length);
                    String methodtag = this.bContextCustomText1.getText().trim();
                    String RequestsTextArginfo = this.RequestsText.getText().trim();
                    if (methodtag.equals("") || null == methodtag){
                        BurpExtender.this.Stderr.println("Custom Request functions1 is null,please check...");
                        return;
                    }
                    String ResultArg = this.buildArgMessage(methodtag, body, RequestsTextArginfo);
                    String Result = Util.sendPost(this.postUrl, ResultArg);
                    messageInfo.setRequest(this.helpers.buildHttpMessage(analyzeRequest.getHeaders(), this.helpers.stringToBytes(Result)));
                } else {
                    byte[] response = messageInfo.getResponse();
                    IResponseInfo analyzedResponse = this.helpers.analyzeResponse(response);

                    byte[] body = Arrays.copyOfRange(response, analyzedResponse.getBodyOffset(), response.length);
                    String methodtag = this.bContextCustomText2.getText();
                    String ResponseTexttArginfo = this.ResponseText.getText().trim();
                    if (methodtag.equals("") || null == methodtag){
                        BurpExtender.this.Stderr.println("Custom Request functions2 is null,please check...");
                        return;
                    }
                    String ResultArg = this.buildArgMessage(methodtag, body, ResponseTexttArginfo);

                    String Result = Util.sendPost(this.postUrl, ResultArg);
                    messageInfo.setResponse(this.helpers.buildHttpMessage(analyzedResponse.getHeaders(), this.helpers.stringToBytes(Result)));
                }

            }
        }
    }

    @Override
    public IMessageEditorTab createNewInstance(IMessageEditorController controller, boolean editable) {
        return new iMessageEditorTab(controller, editable);
    }

    class iMessageEditorTab implements IMessageEditorTab {
        private ITextEditor iTextEditor;
        private byte[] currentMessage;
        private JSONObject obj = null;
        private boolean editable;

        public iMessageEditorTab(IMessageEditorController controller, boolean editable) {
            this.editable = editable;
            iTextEditor = callbacks.createTextEditor();
            iTextEditor.setEditable(editable);
        }

        //        String tmp = "prod_secret123@muc" + new String(body) + random;
        @Override
        public String getTabCaption() {
            return "Sign";
        }

        @Override
        public Component getUiComponent() {
            return iTextEditor.getComponent();
        }

        @Override
        public boolean isEnabled(byte[] content, boolean isRequest) {
            return true;
        }

        @Override
        public void setMessage(byte[] content, boolean isRequest) {
            String out = "";

            if (content == null) {
                // clear our display
                BurpExtender.this.stdout.println("HTTPDataContent is null");
                iTextEditor.setText(null);
                iTextEditor.setEditable(false);
            } else {
                IRequestInfo analyzeRequest = BurpExtender.this.helpers.analyzeRequest(content);
                List<IParameter> parameters = analyzeRequest.getParameters();
                List<String> headers = analyzeRequest.getHeaders();

                String textarea = BurpExtender.this.ParameterText.getText();
//                BurpExtender.this.stdout.println(textarea);
//
                if (textarea.equals("")) {
                    BurpExtender.this.Stderr.println("ParametersTextArea is null, please check...");
                    iTextEditor.setText(null);
                    iTextEditor.setEditable(false);
                    return;
                }
                String[] split = textarea.split("\n");
                for (String item : split) {
                    try {
                        obj = JSON.parseObject(item.trim());
                    } catch (Exception e2) {
                        BurpExtender.this.Stderr.println("The supplied parameter is not JSON, please check." + item);
                        continue;
                    }
                    if (obj.containsKey("POST")) {
                        out += (!out.equals("")) ? "\n" + Util.getArgs(parameters, "1", obj.get("POST").toString()) : Util.getArgs(parameters, "1", obj.get("POST").toString());

                    } else if (obj.containsKey("GET")) {
                        out += (!out.equals("")) ? "\n" + Util.getArgs(parameters, "0", obj.get("GET").toString()) : Util.getArgs(parameters, "0", obj.get("GET").toString());

                    } else if (obj.containsKey("COOKIE")) {
                        out += (!out.equals("")) ? "\n" + Util.getArgs(parameters, "2", obj.get("COOKIE").toString()) : Util.getArgs(parameters, "2", obj.get("COOKIE").toString());

                    } else if (obj.containsKey("HEADER")) {
                        out += (!out.equals("")) ? "\n" + Util.getHeaderArgs(headers, obj.get("HEADER").toString()) : Util.getHeaderArgs(headers, obj.get("HEADER").toString());

                    } else if (obj.containsKey("Body")) {
                        byte[] body = Arrays.copyOfRange(content, analyzeRequest.getBodyOffset(), content.length);
                        //bodyinfoo
                        out += (!out.equals("")) ? "\nYm9keWluZm9v_Body=" + new String(body) : "Ym9keWluZm9v_Body=" + new String(body);
                    } else if (obj.containsKey("String")) {
                        out += (!out.equals("")) ? "\n99999_String=" + obj.get("String").toString() : "99999_String=" + obj.get("String").toString();
                    } else {
                        BurpExtender.this.Stderr.println("Key Input Error, please check: " + item + "...");
                    }
                }

//                BurpExtender.this.stdout.println("out: " + out);
                iTextEditor.setText(out.getBytes());
//                iTextEditor.setText(body);
                iTextEditor.setEditable(editable);
            }
            currentMessage = content;
        }

        @Override
        public byte[] getMessage() {
            byte[] tempcurrentMessage = currentMessage;
            if (iTextEditor.isTextModified()) {
                int c = 0;
                int b = 0;
                String Parameterlocation = "";
                String Parametername = "";
                String Parametervalues = "";
                String name = "";
                String sign = "";


                byte[] TextEditorContent = iTextEditor.getText();
                String[] split = new String(TextEditorContent).split("\n");
                for (String item : split) {
                    if (item.startsWith("not found ") || item.equals("")) {
                        continue;
                    }
                    BurpExtender.this.stdout.println("item: " + item);
                    c = item.indexOf("=");
                    b = item.indexOf("_");
                    Parametervalues = item.substring(c + 1);
                    name = item.substring(0, c);
                    Parametername = name.substring(b + 1);
                    Parameterlocation = name.substring(0, b);

                    sign += Parametervalues;

                    if (Parameterlocation.equals("SGVhZGVy")) {  //Header
                        IRequestInfo analyzeRequest = BurpExtender.this.helpers.analyzeRequest(tempcurrentMessage);
                        List<String> headers = analyzeRequest.getHeaders();

                        List<String> myHeaders = new ArrayList<>();

                        byte[] body = Arrays.copyOfRange(tempcurrentMessage, analyzeRequest.getBodyOffset(), tempcurrentMessage.length);
                        for (String i : headers) {
//                            BurpExtender.this.stdout.println("header: " + i);
                            String tmp = Parametername + ": ";
                            if (i.startsWith(tmp)) {
                                myHeaders.add(tmp + Parametervalues);
                            } else {
                                myHeaders.add(i);
                            }
                        }
                        tempcurrentMessage = BurpExtender.this.helpers.buildHttpMessage(myHeaders, body);
                    } else if (Parameterlocation.equals("Ym9keWluZm9v")) { // Body
//                        BurpExtender.this.stdout.println("Body" + item );
                        IRequestInfo analyzeRequest1 = BurpExtender.this.helpers.analyzeRequest(tempcurrentMessage);

                        List<String> newheaders = analyzeRequest1.getHeaders();
                        tempcurrentMessage = BurpExtender.this.helpers.buildHttpMessage(newheaders, Parametervalues.getBytes());
                    } else if (Parameterlocation.equals("0") || Parameterlocation.equals("1") || Parameterlocation.equals("2")) {
//                        BurpExtender.this.stdout.println("GETPOST" + item );
                        IParameter iParameter = BurpExtender.this.helpers.buildParameter(Parametername, Parametervalues, Byte.parseByte(Parameterlocation));
                        tempcurrentMessage = BurpExtender.this.helpers.updateParameter(tempcurrentMessage, iParameter);
                    } else if (Parameterlocation.equals("99999")) {
                        //Don't do anything
                    } else {
                        BurpExtender.this.Stderr.println("unknown Parameterlocation, please check...");
                    }

                }
                BurpExtender.this.stdout.println("beforesign: " + sign);
                String text = BurpExtender.this.SignParametertext.getText();
                if (!text.equals("") && !sign.equals("")) {
                    String HashEncryption = (String) BurpExtender.this.HASHSelectbox.getSelectedItem();
                    String Encodename = (String) BurpExtender.this.Encodebox.getSelectedItem();
                    String encrypt = "";
                    try {
                        if (HashEncryption.equals("methodtag")){
                            String methodtag = BurpExtender.this.methodtag.getText().trim();
                            String RequestsTextArginfo = BurpExtender.this.RequestsText.getText().trim();
                            String sdata = BurpExtender.this.buildArgMessage(methodtag, sign.getBytes(),RequestsTextArginfo);
                            encrypt = (Encodename.equals("None")) ? Util.sendPost(BurpExtender.this.postUrl, sdata) : EncodeUtil.Encode(Encodename, Util.sendPost(BurpExtender.this.postUrl, sdata));
                        }else {
                            encrypt = (Encodename.equals("None")) ? Util.Encrypt(HashEncryption, sign) : EncodeUtil.Encode(Encodename, Util.Encrypt(HashEncryption, sign));
                        }
                        BurpExtender.this.stdout.println("aftersign: " + encrypt);
                        String[] SignParameters = text.split("\n");

                        for (String item : SignParameters) {
                            obj = JSON.parseObject(item.trim());
                            if (obj.containsKey("GET")) {
                                IParameter iParameter = BurpExtender.this.helpers.buildParameter(obj.get("GET").toString(), encrypt, Byte.parseByte("0"));
                                tempcurrentMessage = BurpExtender.this.helpers.updateParameter(tempcurrentMessage, iParameter);
                            } else if (obj.containsKey("POST")) {
                                IParameter iParameter = BurpExtender.this.helpers.buildParameter(obj.get("POST").toString(), encrypt, Byte.parseByte("1"));
                                tempcurrentMessage = BurpExtender.this.helpers.updateParameter(tempcurrentMessage, iParameter);
                            } else if (obj.containsKey("COOKIE")) {
                                IParameter iParameter = BurpExtender.this.helpers.buildParameter(obj.get("COOKIE").toString(), encrypt, Byte.parseByte("2"));
                                tempcurrentMessage = BurpExtender.this.helpers.updateParameter(tempcurrentMessage, iParameter);
                            } else if (obj.containsKey("HEADER")) {
                                IRequestInfo analyzeRequest = BurpExtender.this.helpers.analyzeRequest(tempcurrentMessage);
                                List<String> headers = analyzeRequest.getHeaders();

                                List<String> myHeaders = new ArrayList<>();

                                byte[] body = Arrays.copyOfRange(tempcurrentMessage, analyzeRequest.getBodyOffset(), tempcurrentMessage.length);
                                for (String i : headers) {
//                            BurpExtender.this.stdout.println("header: " + i);
                                    String tmp = obj.get("HEADER").toString() + ": ";
                                    if (i.startsWith(tmp)) {
                                        myHeaders.add(tmp + encrypt);
                                    } else {
                                        myHeaders.add(i);
                                    }
                                }
                                tempcurrentMessage = BurpExtender.this.helpers.buildHttpMessage(myHeaders, body);
                            } else {
                                BurpExtender.this.Stderr.println("unknown Parameterlocation, The encrypted value cannot be automatically replaced, please check: " + item + "..., SignParameter Only Support GET,POST,Cookie,Header automatically replaced");
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
//                BurpExtender.this.stdout.println("getMessageout: " + new String(tempcurrentMessage));
                return tempcurrentMessage;
//            return new byte[0];
            } else {
                return currentMessage;
            }
        }

        @Override
        public boolean isModified() {
            return iTextEditor.isTextModified();
        }

        @Override
        public byte[] getSelectedData() {
            return iTextEditor.getSelectedText();
        }
    }
}
