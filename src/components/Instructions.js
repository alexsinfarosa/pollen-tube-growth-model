import React from "react";
import { inject, observer } from "mobx-react";

import { Row, Col, Steps } from "antd";
const Step = Steps.Step;

const Instructions = inject("app")(
  observer(function Instructions({ app }) {
    return (
      <Row style={{ maxWidth: 700, margin: "16px auto" }}>
        <Col>
          <p>
            <b>The pollen tube growth model (PTGM)</b> was developed at Virginia
            Tech. It is based on apple pollen tubes growth rates that were
            empirically derived under controlled temperature conditions. Model
            validation has been conducted in Washington, Virginia, and New York
            orchards.
          </p>
          <p>
            The PTGM begins when the desired number of king bloom flowers are in
            full bloom (that is, when the petals no longer cover the
            reproductive organs thus allowing for cross-pollination). The
            desired number of open king bloom flowers is equal to the desired
            crop load and is determined by counting the number of open king
            bloom flowers per tree or by visual assessment of full bloom density
            in the orchard. Average style length is measured at this time and is
            used as a variable in the model.
          </p>
          <p>
            Hourly temperatures recorded in or near the orchard are used with
            the pollen tube growth rate equations to calculate cumulative pollen
            tube growth. Chemical bloom thinning applications are made when the
            pollen tube lengths are equivalent to average style length. The
            supposition is that fertilization has occurred at this point.
          </p>
          <p>
            Assuming that pollen tubes must grow the entire average style length
            on flowers that reached full bloom after an application of a bloom
            thinner, the model is reset after the bloom thinning application is
            made. Additional bloom thinning applications occur before pollen
            tubes grow to the end of the style to prevent additional
            fertilization. Applications cease at the end of bloom. Typically,
            two chemical thinning applications are necessary each year.
            Occasionally, a third application is necessary.
          </p>

          <p>
            Additional information about the Pollen Tube Growth Model and bloom
            thinning in the Eastern U.S. can be found in this{" "}
            <a
              href="http://nyshs.org/wp-content/uploads/2019/05/Peck-Pages-from-NYFQ-BOOK-WInter-2018.1-27-19-4.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fruit Quarterly article{" "}
            </a>
            and this{" "}
            <a
              href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&ved=2ahUKEwjBipSg34niAhXBSt8KHeJTAnAQFjABegQIBBAC&url=https%3A%2F%2Fextension.psu.edu%2Fdownloadable%2Fdownload%2Fsample%2Fsample_id%2F3246%2F&usg=AOvVaw2ugQkcl6-xKESpELye0tgd"
              target="_blank"
              rel="noopener noreferrer"
            >
              Penn State Extension publication
            </a>
          </p>

          <h4>References</h4>
          <div style={{ marginBottom: 16 }}>
            Yoder, K.S., G.M. Peck, L.D. Combs, and R.E. Byers. 2013. Using a
            pollen tube growth model to improve bloom thinning for organic
            production. Acta Horticulturae 1001:207-214.
            <div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://doi.org/10.17660/ActaHortic.2013.1001.23"
              >
                https://doi.org/10.17660/ActaHortic.2013.1001.23
              </a>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            Peck, G.M., L.D. Combs, C. DeLong, and K.S. Yoder. 2016. Precision
            Apple Flower Thinning using Organically Approved Chemicals. Acta
            Horticulturae 1137:47-52.
            <div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href=" https://doi.org/10.17660/ActaHortic.2016.1137.7"
              >
                {" "}
                https://doi.org/10.17660/ActaHortic.2016.1137.7
              </a>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            Peck,G.M., C.N. DeLong, L. Combs, and K.S. Yoder. 2017. Managing
            Apple Crop Load and Diseases with Bloom Thinning Applications in an
            Organically Managed ‘Honeycrisp’/‘MM.111’ Orchard. HortScience
            (523)-377–381.
            <div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://doi.org/10.21273/HORTSCI11412-16"
              >
                https://doi.org/10.21273/HORTSCI11412-16
              </a>
            </div>
          </div>
        </Col>

        <br />

        <Col>
          <Steps direction="vertical" progressDot current={9999}>
            <Step
              title="Create Block"
              description="Click on the '+ Block' button in the upper left to create a new block."
            />
            <Step title="Insert either style length or start date" />
            <Step
              title="Set start date"
              description="You need to provide a date and time."
            />
            <Step
              title="Set style length"
              description="There are two options: The fist option is to insert the average style length. The second option is to insert the style length measurements, the software in this case will calculate the average."
            />
          </Steps>
        </Col>
      </Row>
    );
  })
);

export default Instructions;
