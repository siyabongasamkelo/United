import React from "react";
import { Flex } from "../../../components/atoms/Flex";
import { Button } from "../../../components/atoms/Button";
import { Spacer } from "../../../components/atoms/Spacer";
import * as F from "./RegisterForm.styles";

// Since no props are needed yet, we don't need a custom interface

export const RegisterForm: React.FC = () => {
  return (
    <F.FormContainer>
      <F.Form></F.Form>
    </F.FormContainer>
  );
};
