import styled from "styled-components";

export const HomeCover = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;

  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1)),
    url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
`;
