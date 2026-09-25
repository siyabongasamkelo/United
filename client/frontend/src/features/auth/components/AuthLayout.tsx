import React from "react";
import * as S from "./AuthLayout.styles";
import { Flex } from "../../../components/atoms/Flex";
import panelImage from "../../../assets/panel.jpeg";
import { Button } from "../../../components/atoms/Button";
import { Spacer } from "../../../components/atoms/Spacer";
import { useTheme } from "styled-components";
interface AuthLayoutProps {
  children: React.ReactNode;
}
export const AuthLayout: React.FC = ({ children }) => {
  const theme = useTheme();
  return (
    <S.LayoutContainer>
      <Flex
        direction="row"
        align="flex-start"
        gap="0rem"
        justify="space-between"
      >
        <S.VisualPanel>
          <Flex
            direction="column"
            align="center"
            gap="0rem"
            justify="flex-start"
          >
            <S.BackButton>
              <Flex
                direction="column"
                align="flex-start"
                gap="0rem"
                justify="flex-start"
              >
                <Spacer $mt={theme.spacing.xl} />
                <Button $w={"100px"}>Back</Button>
                <Spacer $mt={theme.spacing.xl} />
              </Flex>
            </S.BackButton>

            <S.VisualPanelImage>
              <img src={panelImage} alt="image" />
            </S.VisualPanelImage>
          </Flex>
        </S.VisualPanel>
        <S.FormPanel>
          <Flex direction="row" align="center" gap="0rem" justify="flex-start">
            {children}
          </Flex>
        </S.FormPanel>
      </Flex>
    </S.LayoutContainer>
  );
};
