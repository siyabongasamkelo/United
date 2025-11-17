import styled from "styled-components";

export const AboutUsCardContainer = styled.div`
  height: 55vh;
  width: 25%;
  margin-top: 5%;
  text-align: center;
`;

export const CardImage = styled.div`
  height: 60%;
  img {
    height: 100%;
    width: 100%;
  }
`;

export const CardText = styled.div`
  height: 40%;
  h3 {
    color: ${(props) => props.theme.color.primary};
    margin-top: 5%;
  }
  p {
    color: rgba(0, 0, 0, 0.7);
  }
`;
