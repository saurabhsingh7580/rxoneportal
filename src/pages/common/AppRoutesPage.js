import { useContext, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { HospitalsProvider } from "../../context/hospitals-context";
import { ModeProvider } from "../../context/mode-context";
import { PaymentsProvider } from "../../context/payments-context";
import { RxPointsProvider } from "../../context/rx-points-context";
import SidebarDisplayContext from "../../context/sidebar-display";
import AppHeader from "../../components/app-header/AppHeader";
import Sidebar from "../../components/sidebar/Sidebar";

function AppRoutesPage(props) {
  const { displayClass } = useContext(SidebarDisplayContext);

  return (
    <Container fluid>
      <Row style={{ minHeight: "100vh", position: "relative" }}>
        <Col
          as="aside"
          xs={9}
          sm={4}
          md={3}
          lg={2}
          className={`px-0 ${displayClass} d-sm-block`}
          style={{
            backgroundColor: "#4d9aa6",
            minHeight: "100vh",
            position: "fixed",
          }}
        >
          <Sidebar />
        </Col>

        <div
          className={`sidebar-backdrop d-sm-none ${
            displayClass !== "d-none" ? "d-block" : "d-none"
          }`}
        ></div>

        <Col
          sm={8}
          md={9}
          lg={10}
          className="px-0 pb-4"
          style={{ minHeight: "100vh", position: "absolute", right: "0" }}
        >
          <ModeProvider>
            <HospitalsProvider>
              <PaymentsProvider>
                <RxPointsProvider>
                  <AppHeader />
                  {props.children}
                </RxPointsProvider>
              </PaymentsProvider>
            </HospitalsProvider>
          </ModeProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default AppRoutesPage;
