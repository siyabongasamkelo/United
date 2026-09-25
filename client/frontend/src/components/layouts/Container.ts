import styled from "styled-components";

interface ContainerProps {
  maxWidth?: string;
  padding?: string;
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: ${(props) => props.maxWidth || "1200px"};
  margin: 0 auto;
  padding: ${(props) => props.padding || "0 20px"};
  box-sizing: border-box;
`;
