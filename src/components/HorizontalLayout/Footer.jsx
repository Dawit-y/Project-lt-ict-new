import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap"
import { FOOTER_TEXT, COPYRIGHT_YEAR } from "../../constants/constantFile";
import { useAuthUser } from "../../hooks/useAuthUser";

const Footer = () => {
	const { user: authUser } = useAuthUser();
	const userDetail = authUser.user_detail;
	return (
		<React.Fragment>
			<footer className="footer">
				<Container fluid={true}>
					<Row>
						<Col md={6}>
							{COPYRIGHT_YEAR} -- {userDetail}
						</Col>
						<Col md={6}>
							<div className="text-sm-end d-none d-sm-block">{FOOTER_TEXT}</div>
						</Col>
					</Row>
				</Container>
			</footer>
		</React.Fragment>
	);
};
export default Footer