import { motion } from "motion/react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

export const Section = ({ title, isOpen, toggleSection, children }) => (
    <>
      <motion.h2 layout onClick={toggleSection} className="pointer">
        <div className="accordion">
          <span>{title}</span>
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        </div>
      </motion.h2>
      {isOpen && children}
    </>
  );
  
  Section.propTypes = {
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleSection: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };
  