import styled from "styled-components";

export const HeaderSliderStyled = styled.div`
  height: 100vh;
  width: 100%;
  background-color: white;
  position: absolute;
  z-index: 1;
  top: 0%;
  border-radius: 10px 0 0 10px;
  overflow-x: hidden;
  @media only screen and (min-width: 992px) {
    display: none;
  }
`;

export const CloseButton = styled.div`
  height: 40px;
  margin-bottom: 20%;
  svg {
    fill: rgba(0, 0, 0, 0.8);
    transform: scale(3);
    margin: 30px;
  }
`;

export const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  a {
    color: ${({ theme }) => theme.color.secondary};
  }
  text-align: center;
  text-decoration: none;
  font-size: 44px;
  font-weight: 800;
`;

export const Copyrights = styled.p`
  color: ${({ theme }) => theme.color.secondary};
  text-align: center;
  margin-top: 30%;
`;
