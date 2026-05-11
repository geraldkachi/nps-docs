// src/data/docsData.ts
import type { DocPage } from '../types';

export const docPages: DocPage[] = [
  {
    url: "https://nps-documentation.nibss-plc.com.ng/docs/national-payment-stack-nps/at4heqfolm224-welcome-page",
    title: "Welcome to the Integration Guide",
    markdown: `# Welcome to the Integration Guide

Glad you made it here! This document is your essential guide to integrating with our ISO 20022-compliant payment switch. It offers a clear, structured pathway to connect with our platform using industry-standard messaging formats—enabling secure, high-quality, and interoperable financial transactions.

Whether you are launching a new service or enhancing an existing system, this guide is designed to get you integration-ready with speed and minimal complexity. Inside, you will find everything you need: technical specifications, setup instructions, message structure details, and validation checkpoints.

This is an evolving version of the integration guide, and we welcome your feedback. If you encounter bugs, have concerns, or see opportunities for improvement, please don't hesitate to let us know. Your input is invaluable as we continue refining the developer's experience.

Our goal is simple—help you build with confidence and deliver at scale.

**From the NPS Delivery Team**`
  },
  {
    url: "https://nps-documentation.nibss-plc.com.ng/docs/national-payment-stack-nps/6iv2f53rwf5ud-what-you-need-to-get-started",
    title: "What You Need to Get Started",
    markdown: `# What You Need to Get Started

Before diving in, ensure you have access to the following:

1. **Network access** to the NIBSS test environment for bi-directional communication (i.e. IP whitelisting - provided upon request)

2. **A working understanding** of ISO 20022 message structures (see resources in appendix)

3. **Your institution's unique integration credentials** for test (provided by our onboarding team)

4. **An HTTPS endpoint** to receive request or callbacks (where applicable). Your HTTPS endpoint should follow the format as outlined below:

   - \`https://{{BASE_URL}}/pacs008\` to receive a pacs.008 message
   - \`https://{{BASE_URL}}/pacs002\` to receive a pacs.002 message
   - \`https://{{BASE_URL}}/pacs028\` to receive a pacs.028 message
   - \`https://{{BASE_URL}}/acmt023\` to receive an acmt.023 message
   - \`https://{{BASE_URL}}/acmt024\` to receive an acmt.024 message

**Replace {{BASE_URL}} with your actual base URL**

5. **A unique FQDN (Fully Qualified Domain Name)** for your institution.

**NB: All FQDN must be unique across institutions**

> **NOTE:** All Endpoint communication is conducted over **HTTPS**.`
  },
  {
    url: "https://nps-documentation.nibss-plc.com.ng/docs/national-payment-stack-nps/crur0jyjhdpa5-test-case-and-validation",
    title: "Test Case and Validation",
    markdown: `# Test Case and Validation

We provide a suite of test cases that cover both positive and negative scenarios for each message type. Test results must be submitted for review before production credentials are issued.

Replace the **<nps-ip-you-are-calling>** in the sample requests below with the IP if connecting over the extranet VPN or domain name if connecting over the internet VPN.

> **Note: Do not use postman for testing and validation, utilize your IDE for this purpose**

## Phase 1: Outbound Message Validation (Request)

### Step 1: Get a Valid Pacs.008 Message

\`\`\`bash
curl -i --location 'https://<nps-ip-you-are-calling>:8022/nps/pacs' \\
  --header 'Content-Type: application/xml' \\
  --data-raw '<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<ns2:Document xmlns:ns2="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.12">
    <FIToFICstmrCdtTrf>
        <GrpHdr>
            <MsgId>99905820250721095222930239203831889</MsgId>
            <CreDtTm>2025-02-25T09:52:22.954Z</CreDtTm>
            <BtchBookg>false</BtchBookg>
            <NbOfTxs>1</NbOfTxs>
            <SttlmInf>
                <SttlmMtd>CLRG</SttlmMtd>
            </SttlmInf>
        </GrpHdr>
    </FIToFICstmrCdtTrf>
</ns2:Document>'
\`\`\`

### Signature and Encryption Procedure

To ensure message integrity and authenticity, you would be required to sign and verify complete ISO 20022 messages in accordance with the W3C XML Signature (XMLDSIG) standard.

#### Java Signing Example

\`\`\`java
package org.example.signer;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.w3c.dom.Document;
import javax.xml.crypto.dsig.*;
import javax.xml.crypto.dsig.dom.DOMSignContext;
import java.security.*;

public final class Signer {
    static {
        Security.addProvider(new BouncyCastleProvider());
        org.apache.xml.security.Init.init();
    }
    
    public static void sign(Document doc, PrivateKey privateKey) throws Exception {
        XMLSignatureFactory sigFactory = XMLSignatureFactory.getInstance("DOM");
        
        Reference ref = sigFactory.newReference(
            "",
            sigFactory.newDigestMethod(DigestMethod.SHA256, null),
            Collections.singletonList(
                sigFactory.newTransform(Transform.ENVELOPED, null)
            ),
            null,
            null
        );
        
        SignedInfo signedInfo = sigFactory.newSignedInfo(
            sigFactory.newCanonicalizationMethod(
                CanonicalizationMethod.INCLUSIVE, null),
            sigFactory.newSignatureMethod(SignatureMethod.RSA_SHA256, null),
            Collections.singletonList(ref)
        );
        
        DOMSignContext dsc = new DOMSignContext(privateKey, doc.getDocumentElement());
        XMLSignature signature = sigFactory.newXMLSignature(signedInfo, null);
        signature.sign(dsc);
    }
}
\`\`\`

#### Python Signing Example

\`\`\`python
from signxml import XMLSigner, methods
from lxml import etree

# Load XML
with open("pacs008.xml", "rb") as f:
    xml_data = f.read()
root = etree.fromstring(xml_data)

# Sign XML (RSA-SHA256, C14n)
signer = XMLSigner(
    method=methods.enveloped,
    signature_algorithm="rsa-sha256",
    digest_algorithm="sha256",
    c14n_algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
)

# Load Private Key & Certificate
with open("private_key.pem", "rb") as f:
    key_data = f.read()
with open("cert.pem", "rb") as f:
    cert_data = f.read()

# Sign Document
signed_root = signer.sign(root, key=key_data, cert=cert_data)

# Output Signed XML
signed_xml = etree.tostring(signed_root, pretty_print=True, xml_declaration=True, encoding="UTF-8")
with open("pacs008_signed.xml", "wb") as f:
    f.write(signed_xml)
\`\`\`

### XML Encryption Steps

1. Select XML elements to encrypt
2. Initialize XML encryption engine (AES-256-GCM for payload encryption)
3. Generate AES-256 session key
4. Encrypt session key using your institution's RSA public key
5. Encrypt the payload using the AES-256 session key
6. Replace sensitive elements with <EncryptedData> in the XML`
  },
  {
    url: "https://nps-documentation.nibss-plc.com.ng/docs/national-payment-stack-nps/0ruk9xu8myekw-nps-iso-tags",
    title: "NPS - ISO20022 Tag Details",
    markdown: `# NPS - ISO20022 Tag Details

## Account Designation (AccountDesignation)

| Account Designation ID | Description |
| --- | --- |
| 1 | Corporate |
| 2 | Individual |
| 3 | Joint |
| 4 | Others |
| 5 | Juvenile |
| 6 | Sole Proprietorship |

## Account Tier (AccountTier)

| Account Tier ID | Description |
| --- | --- |
| 0 | Virtual Account |
| 1 | Tier 1 |
| 2 | Tier 2 |
| 3 | Tier 3 |

## Channel Codes (ChannelCode)

| Codes | Channel Names |
| --- | --- |
| 1 | Bank Teller |
| 2 | Internet Banking |
| 3 | Mobile Phones |
| 4 | POS Terminals |
| 5 | ATM |
| 6 | Vendor/Merchant Web Portal |
| 7 | Third-Party Payment Platform |
| 8 | Unstructured Supplementary Service Data (USSD) |
| 9 | Other Channels |
| 10 | Social Media |
| 11 | Agency Banking |

## Settlement Method (SttlmMtd)

| CodeName | Name | Definition |
| --- | --- | --- |
| INDA | InstructedAgent | Settlement is done by the agent instructed to execute a payment instruction |
| INGA | InstructingAgent | Settlement is done by the agent instructing and forwarding the payment |
| COVE | CoverMethod | Settlement is done through a cover payment |
| CLRG | ClearingSystem | Settlement is done through a payment clearing system |

## Clearing Channel (ClrChanl)

| CodeName | Name | Definition |
| --- | --- | --- |
| RTGS | RealTimeGrossSettlementSystem | Settlement through a real-time gross settlement system |
| RTNS | RealTimeNetSettlementSystem | Settlement through a real-time net settlement system |
| MPNS | MassPaymentNetSystem | Settlement through a mass payment net settlement system |
| BOOK | BookTransfer | Payment through internal book transfer |

## Local Instrument (LclInstrm)

| CodeName | Name |
| --- | --- |
| CSDC | Bulk Customer Direct Credit payments |
| CTAA | Customer Transfer Account to Account |
| CTAW | Customer Transfer Account to Wallet |
| CTWA | Customer Transfer Wallet to Account |

## Charge Bearer (ChrgBr)

| CodeName | Name | Definition |
| --- | --- | --- |
| DEBT | BorneByDebtor | All transaction charges are to be borne by the debtor |
| CRED | BorneByCreditor | All transaction charges are to be borne by the creditor |
| SHAR | Shared | Transaction charges on sender side by debtor, receiver side by creditor |
| SLEV | FollowingServiceLevel | Charges applied following service level and/or scheme rules |

## Group Status (GrpSts)

| CodeName | Name |
| --- | --- |
| ACSC | Accepted Settlement Completed |
| RJCT | Rejected |

## NPS ID Format

| ID | Format | Length | Example |
| --- | --- | --- | --- |
| MsgId | Source Institution ID + yyyymmddhhmmss + 15 randomized digits | 35 chars | 000014202505161230454839201374650 |
| TxId | Source Institution ID + yyyymmddhhmmss + 15 randomized digits | 35 chars | 000014202505161230454839201374650 |
| EndToEndId | Source Institution ID + 29 randomized digits | 35 chars | 00001484930284756473829104637281 |
| InstrId | Source ID + Destination ID + yyyymmddHHmmss + 9 randomized | 35 chars | 000014999999202505161230459438275 |`
  },
  {
    url: "https://nps-documentation.nibss-plc.com.ng/docs/national-payment-stack-nps/xcxq6sb4rcpnp-appendix-and-faq",
    title: "Appendix and FAQ",
    markdown: `# Appendix and FAQ

## Frequently Asked Questions

### General Integration Questions

**01. What is the purpose of the ISO 20022 payment switch?**
- It facilitates standardized, high-quality financial messaging across institutions to ensure faster, secure, and interoperable payments.

**02. What message types are supported?**
- We currently support \`pacs.008\`, \`pacs.002\`, \`pacs.028\`, \`acmt.023\`, \`acmt.024\` and \`Get Participants\`.

**03. Is a test environment available?**
- Yes, we provide a sandbox environment for development and certification.

**04. What format should messages be in?**
- All messages must conform to ISO 20022 XML schemas.

**05. What are the primary endpoints I'll interact with?**
- All primary endpoints for this phase have been included in the document. Others will be added subsequently.

**06. What happens if my message fails validation?**
- The system will return a \`pacs.002\` response with detailed error codes.

**07. Is schema validation required before going live?**
- Yes. All messages must pass schema validation during certification.

**08. Where can I get sample messages?**
- Valid sample messages are included in this document. You can also find examples on the ISO 20022 website.

**09. Do I need a static IP?**
- Yes. This is required for whitelisting as an additional security measure.

**10. Can I register multiple callback URLs?**
- Yes, we support one (1) URL each for test and production environments, respectively.

**11. What tools can I use for development?**
- Curl, XML editors, and schema validators are commonly used. **NB:** Do not use Postman.

### Encryption & Signature Issues

**1. Why do I get an "Unable to decrypt" error from NIBSS?**
- Verify that encryption algorithms match specifications:
  - **AES-256**
  - **RSA-OAEP-SHA256** for key encryption
  - Proper IV generation for CBC mode

**2. Why does signature validation fail?**
- Signature is placed inside encrypted data instead of outside
- Canonicalization errors (extra spaces, indentation, or wrong line endings)
- Wrong algorithm used (must be **RSA-SHA256**)

**3. Why can't I validate and decrypt separately?**
- Validation and decryption must be handled together. Doing one without the other will result in a **400 Bad Request**.

### Message Format Issues

**1. Why am I getting HTTP 400 errors?**
Common causes:
- Extra whitespace, indentation, or line breaks in XML
- Incorrect canonicalization (C14n)
- Invalid or missing XML declaration
- Invalid signature or decryption failure

**2. What format should Message IDs (MsgId) follow?**
- Exactly **35 characters**
- Format: \`sourceID + yyyymmddhhmmss + 15 random digits\`
- No whitespace or special characters

**3. What format should date and time fields follow?**
- Use ISO 8601: \`YYYY-MM-DDThh:mm:ss\`
- Example: \`2025-08-28T14:00:00\`

### Common Pitfalls

**What should I avoid to prevent request errors?**
- Do not add indentation, line breaks, or extra spaces in XML
- Always send the **raw XML string**, not the XML file
- Ensure IBAN/account numbers are exactly **10 digits**
- Validate both signature and encryption together
- A \`400 Bad Request\` almost always means:
  - Invalid signature, or
  - Request could not be decrypted

## Support and Escalation

Our integration support team is here to help you throughout your journey. We offer support via email, teams (for approved integrators), and scheduled technical calls.

**Teams (invite only):** Available on request`
  },
  {
    url: "https://nps-documentation.nibss-plc.com.ng/docs/national-payment-stack-nps/cbfqgfoc5mvri-national-payment-stack-nps",
    title: "API Reference - National Payment Stack",
    markdown: `# National Payment Stack (NPS) API Reference

## API Base URL

\`\`\`
NPS Server: https://<nps-ip-you-are-calling>:8022/nps
\`\`\`

## Available Endpoints

### acmt.023 Message
**POST** \`/acmt\`
- Account management message for identity verification request

### acmt.024 Message
**POST** \`/acmt\`
- Account management message for identity verification report

### camt.060 Message
**POST** \`/camt\`
- Account reporting request message

### camt.052 Message
**POST** \`/camt\`
- Bank-to-customer account report (intraday)

### camt.053 Message
**POST** \`/camt\`
- Bank-to-customer statement (end of day)

### pacs.008 Message
**POST** \`/pacs\`
- FIToFI Customer Credit Transfer

### pacs.002 Message
**POST** \`/pacs\`
- FIToFI Payment Status Report

### pacs.028 Message
**POST** \`/pacs\`
- FIToFI Payment Status Request

### Get Participants
**GET** \`/participants\`
- Retrieve list of participants in the NPS network

## Message Requirements

All messages must:
1. Conform to ISO 20022 XML schemas
2. Be digitally signed using RSA-SHA256
3. Be encrypted using AES-256-GCM
4. Include proper message IDs following the specified format
5. Be sent as raw XML string without extra whitespace`
  },
  {
    url: "https://nps-documentation.nibss-plc.com.ng/docs/national-payment-stack-nps/93jfnl8ujp0uj-nps-easy-pay",
    title: "NPS-EasyPay",
    markdown: `# NPS-EasyPay

## Introduction

The NPS-EasyPay is an ISO 20022 compliant service, operating as a participating institution on the National Payment Stack (NPS). It provides standardized interfaces that enable financial institutions and authorized participants to perform customer-to-institution credit transfer requests within the NPS ecosystem.

## Core Functionalities

- **Account and mandate validation** - confirming beneficiary details prior to initiating payments
- **Payment execution** - involving secure debit of an originator account and credit of a beneficiary account
- **Transaction status reporting** - providing definitive outcomes for each payment instruction

## Connecting to NPS-EasyPay

### Endpoint Format

\`\`\`
https://<nps-ip>:8022/nps/pain/001
\`\`\`

### Message Flow Summary

| Step | Description | Message Type |
| --- | --- | --- |
| 1 | Institution initiates a payment instruction into the NPS network | pain.001 |
| 2 | NPS routes the message to NPS-EasyPay | pain.001 |
| 3 | NPS-EasyPay performs business validations | — |
| 4 | NPS-EasyPay attempts secure debit of originator account | — |
| 5 | NPS-EasyPay attempts secure credit of beneficiary account | — |
| 6 | NPS-EasyPay generates payment status response | pain.002 |
| 7 | Response returned to institution via NPS | pain.002 |
| 8 | Institution acknowledges receipt | HTTP 200 |

## PAIN.001 Processing Model

**Two-Leg Transaction Structure**

A \`pain.001\` transaction consists of two logical legs:
1. **Debit Leg** – Debiting the sender's account
2. **Credit Leg** – Crediting the beneficiary's account

### PAIN.002 Response Outcomes

| Outcome | Debit Leg | Credit Leg |
| --- | --- | --- |
| **Successful** | Successful | Successful |
| **Partial** | Successful | Failed |
| **Failed** | Failed | Failed |

## Sample pain.001 Request

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.12">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>99905720260225144722037299534778744</MsgId>
      <CreDtTm>2026-02-25T14:47:22.637+01:00</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>120.51</CtrlSum>
      <InitgPty>
        <Nm>Musa</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT-20251016-001-SINGLE</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>
        <Dt>2026-02-17Z</Dt>
      </ReqdExctnDt>
      <Dbtr>
        <Nm>Musa</Nm>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <IBAN>0177136558</IBAN>
        </Id>
      </DbtrAcct>
      <DbtrAgt>
        <FinInstnId>
          <ClrSysMmbId>
            <MmbId>999057</MmbId>
          </ClrSysMmbId>
        </FinInstnId>
      </DbtrAgt>
      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>99905746102951471838787625821100514</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="NGN">120.51</InstdAmt>
        </Amt>
        <CdtrAgt>
          <FinInstnId>
            <ClrSysMmbId>
              <MmbId>999058</MmbId>
            </ClrSysMmbId>
          </FinInstnId>
        </CdtrAgt>
        <Cdtr>
          <Nm>James</Nm>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>3157417712</IBAN>
          </Id>
        </CdtrAcct>
        <RmtInf>
          <Ustrd>Invoice 12345</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>
\`\`\``
  }
];

export const navigationItems = [
  { title: "Welcome to NPS", url: docPages[0].url },
  { title: "Getting Started", url: docPages[1].url },
  { title: "Test Case & Validation", url: docPages[2].url },
  { title: "ISO20022 Tag Details", url: docPages[3].url },
  { title: "Appendix & FAQ", url: docPages[4].url },
  { title: "API Reference", url: docPages[5].url },
  { title: "NPS-EasyPay", url: docPages[6].url },
];