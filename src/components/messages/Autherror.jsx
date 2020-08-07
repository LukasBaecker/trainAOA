import { Result, Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import React from "react";
const { Paragraph, Text } = Typography;

const Autherror = () => {
  return (
    <Result
      className="main-container"
      status="error"
      title="Authorization Failed"
      subTitle="Please check and modify the following information before resubmitting."
    >
      <div className="desc">
        <Paragraph>
          <Text
            strong
            style={{
              fontSize: 16,
            }}
          >
            The content you wanted to reach has the following error:
          </Text>
        </Paragraph>
        <Paragraph>
          <CloseCircleOutlined className="site-result-demo-error-icon" /> You
          have no access to the this page. Login to see the user page.
        </Paragraph>
        <Paragraph>
          <CloseCircleOutlined className="site-result-demo-error-icon" /> Please
          login with the right account to see the page.
        </Paragraph>
      </div>
    </Result>
  );
};

export default Autherror;
