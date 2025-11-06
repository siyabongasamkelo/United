import styled from "styled-components";

export const Button = styled.button`
  height: 45px;
  width: 140px;
  border-radius: 20px;
  border: none;
  background-color: ${(props) => props.theme.color.primary};

  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7.6px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: 0.5s ease-in-out;
  color: rgba(255, 255, 255, 0.8);

  &:hover {
    background-color: ${(props) => props.theme.color.primary};
    box-shadow: 0 5px 15px rgb(255, 247, 209);
    border: 1px solid rgba(255, 255, 255, 0.8);
  }
`;

export default Button;
