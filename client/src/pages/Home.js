import React from "react";
import { HomeCover } from "./Home.styled";
// import homeImage from "../assets/img/home.jpeg";
import { Container } from "react-bootstrap";
import Header from "../components/common/Header";

const Home = () => {
  return (
    <Container>
      <HomeCover>
        <Header />
      </HomeCover>
    </Container>
  );
};

export default Home;
