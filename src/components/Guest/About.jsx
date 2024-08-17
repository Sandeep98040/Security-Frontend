import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import { ResponsiveAppBarLandingPage } from '../AppBar/ResponsiveAppBarLandingPage';

export const About = () => {
  return (
    <div style={styles.pageContainer}>
      <ResponsiveAppBarLandingPage />
      <Box sx={styles.contentBox}>
        <Typography variant="h3" component="h4" gutterBottom align="center" sx={styles.title}>
          About Us <SmartphoneIcon style={styles.icon} />
        </Typography>

        <Typography variant="body1" paragraph align="center" sx={styles.description}>
          Welcome to our mobile and accessories store! We are committed to offering the best quality 
          products and exceptional customer service. Discover more about our journey and values below.
        </Typography>

        <Accordion sx={styles.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={styles.expandIcon} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={styles.accordionSummary}
          >
            <Typography sx={styles.accordionTitle}>
              <SmartphoneIcon style={styles.iconSmall} /> Our Journey
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={styles.accordionDetails}>
            <Typography>
              Our store began with a passion for technology and innovation. From humble beginnings, 
              we've grown into a trusted source for mobile devices and accessories.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={styles.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={styles.expandIcon} />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            sx={styles.accordionSummary}
          >
            <Typography sx={styles.accordionTitle}>
              <SmartphoneIcon style={styles.iconSmall} /> Our Mission
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={styles.accordionDetails}>
            <Typography>
              Our mission is to deliver cutting-edge mobile technology and accessories that enhance 
              your digital experience. We strive to be your go-to destination for all your tech needs.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={styles.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={styles.expandIcon} />}
            aria-controls="panel3a-content"
            id="panel3a-header"
            sx={styles.accordionSummary}
          >
            <Typography sx={styles.accordionTitle}>
              <SmartphoneIcon style={styles.iconSmall} /> Meet the Team
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={styles.accordionDetails}>
            <Typography>
              Our team is comprised of tech enthusiasts who are passionate about helping you find the 
              perfect products. We bring our expertise and love for technology to everything we do.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: '#e3f2fd',
    color: '#000000',
    minHeight: '100vh',
    padding: '20px',
  },
  contentBox: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  description: {
    fontSize: '1.1rem',
    color: '#555555',
    marginBottom: '20px',
  },
  accordion: {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  accordionSummary: {
    backgroundColor: '#e3f2fd',
    borderRadius: '8px',
  },
  accordionTitle: {
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  accordionDetails: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '10px 20px',
  },
  expandIcon: {
    color: '#1e88e5',
  },
  icon: {
    color: '#1e88e5',
    fontSize: '2rem',
    marginLeft: '10px',
  },
  iconSmall: {
    color: '#1e88e5',
    marginRight: '10px',
  },
};

export default About;
