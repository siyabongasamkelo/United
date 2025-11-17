import {
  CloseButton,
  HeaderSliderStyled,
  LinksContainer,
  Copyrights,
} from "./HeaderSlider.styled";
import { X } from "react-bootstrap-icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeaderSlider = ({ closeMenu, setCloseMenu, display }) => {
  return (
    <HeaderSliderStyled
      as={motion.div}
      animate={{
        x: -35,
        width: closeMenu ? 0 : 420,
      }}
      transition={{ duration: 0.5 }}
      dis={display}
    >
      <CloseButton>
        <X onClick={setCloseMenu} />
      </CloseButton>
      <LinksContainer onClick={setCloseMenu}>
        <Link to={"/"}>Home</Link>
        <Link to={"/shop"}>About Me</Link>
        <Link to={"/Cart"}>My Projects</Link>
        <Link to={"/login"}>Login</Link>
        <Link to={"/contact"}>Contact</Link>
      </LinksContainer>
      <Copyrights>
        Siyabonga Mazibuko &copy; {new Date().getFullYear()}
      </Copyrights>
    </HeaderSliderStyled>
  );
};

export default HeaderSlider;
