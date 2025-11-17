import styled from "styled-components";

export const AboutUsStyled = styled.div`
  height: 100vh;
`;

export const AboutHeaderAndIntro = styled.div`
  margin-top: 5%;
  h1 {
    font-size: 5rem;
    color: ${({ theme }) => theme.color.secondary};
    text-align: center;
  }
  div {
    width: 60%;
    margin-left: 20%;
    p {
      font-family: "Chewy", system-ui;
      text-align: center;
      color: rgba(0, 0, 0, 0.6);
    }
  }

  @media only screen and (max-width: 600px) {
    h1 {
      font-size: 2.5rem;
    }
    div {
      width: 80%;
      margin-left: 10%;

      p {
        font-size: 0.8rem;
      }
    }
  }
`;

export const AboutUsCardsDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;
