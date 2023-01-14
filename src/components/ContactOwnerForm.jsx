import React, { useState } from "react";

/* *************************************************** */

/* Component starts */
const ContactOwnerForm = ({ ownercontactNum, ownerEmail, ownerName, propertyName }) => {
  /* Component states declaration starts */
  const [message, setMessage] = useState("");
  /* Component states declaration ends */

  /* Component rendering. JSX code starts */
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Owner</p>
      </header>
      <main>
        <div className="contactLandlord">
          <p className="landlordName">Contact {ownerName}</p>
          <p className="landlordNum">Phone: {ownercontactNum}</p>
        </div>
        <form className="messageForm">
          <div className="messageDiv">
            <label htmlFor="message" className="messageLabel">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              className="textarea"
              value={message}
              onChange={({ target }) => setMessage(target.value)}
            ></textarea>
          </div>
          <a
            href={`mailto:${ownerEmail}?Subject=${propertyName}&body=${message}`}
          >
            <button type="button" className="primaryButton">
              Send Message
            </button>
          </a>
        </form>
      </main>
    </div>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default ContactOwnerForm;
