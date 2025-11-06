import styled from "styled-components";

export const HeaderWrapper = styled.header`
  height: 10vh;
  width: 90%;
  margin-left: 5%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Freckle Face", system-ui;
  font-family: "Chewy", system-ui;

  svg {
    display: none;
  }
  @media only screen and (max-width: 600px) {
    svg {
      display: block;
      transform: scale(200%);
    }
    button {
      display: none;
    }
  }

  h3 {
    color: ${(props) => props.theme.color.text};

    cursor: pointer;
    transition: 0.5s ease-in-out;
    &:hover {
      color: #fff7d1;
    }
  }
`;

export const Links = styled.div`
  margin-left: -15px;
  ul {
    list-style: none;
    display: flex;
  }

  a {
    padding-left: 15px;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.6);
  }
  @media only screen and (max-width: 600px) {
    display: none;
  }
`;
