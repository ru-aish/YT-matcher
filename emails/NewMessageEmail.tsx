import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NewMessageEmailProps {
  dealId: number;
}

export const NewMessageEmail = ({
  dealId,
}: NewMessageEmailProps) => (
  <Html>
    <Head />
    <Preview>You have a new message regarding your sponsorship deal</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Message Received</Heading>
        <Text style={text}>
          You have a new message regarding your sponsorship deal.
        </Text>
        <Link href={`https://yt-matcher.vercel.app/deal/${dealId}`} style={button}>
          Click here to reply
        </Link>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0 20px",
  margin: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  padding: "0 20px",
  margin: "16px 0",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "5px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  lineHeight: "50px",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "200px",
  marginLeft: "20px",
};

export default NewMessageEmail;
