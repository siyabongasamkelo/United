import styled from "styled-components";

export const AboutUsCardContainer = styled.div`
  /* height: 55vh; */
  width: 25%;
  margin-top: 5%;
  text-align: center;
  cursor: pointer;

  &:hover {
    box-shadow: 0 5px 15px rgb(255, 247, 209);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 10px rgba(255, 247, 209, 0.7),
      0 0 20px rgba(255, 247, 209, 0.5);
    filter: brightness(1.05);
    box-shadow: 10px 10px 40px 10px ${(props) => props.theme.color.primary};
  }

  @media only screen and (max-width: 600px) {
    width: 80%;
  }
`;

export const CardImage = styled.div`
  /* height: 60%; */
  height: 40vh;
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

  @media only screen and (max-width: 600px) {
    p {
      font-size: 0.8rem;
    }
  }
`;
