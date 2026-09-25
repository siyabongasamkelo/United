import styled from "styled-components";
export const LayoutContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.colors.background};
`;

export const VisualPanel = styled.div`
  width: 50%;
  height: 100%;
`;

export const VisualPanelImage = styled.div`
  height: 70%;
  width: 60%;
  img {
    height: 100%;
    width: 100%;
  }
`;

export const BackButton = styled.div`
  width: 60%;
`;

export const FormPanel = styled.div`
  width: 50%;
  height: 100%;
`;

export const InnerFormContainer = styled.div``;

export const BrandLogo = styled.div``;
