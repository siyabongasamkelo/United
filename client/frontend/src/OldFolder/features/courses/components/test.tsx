import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Grid, 
  Chip,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MapIcon from '@mui/icons-material/Map';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

export default function App() {
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 6 }}>
      
      {/* 1. Header Navigation Bar */}
      <Box sx={{ bgcolor: '#1e1b4b', color: 'white', py: 2.5, px: 2, textAlign: 'center', boxShadow: 1 }}>
        <Typography variant="h6" fontWeight="800" letterSpacing={0.5}>
          UTS ONBOARDING PORTAL
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500, display: 'block', mt: 0.5 }}>
          Gateway Theatre of Shopping — Floor Deployment Shell v1.0
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '500px', mx: 'auto', p: 2 }}>
        
        {/* 2. Interactive Geographic Anchor Map (Game-Clicks-Dischem Axis) */}
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 3, borderColor: '#e2e8f0', bgcolor: '#ffffff' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MapIcon color="primary" size="small" />
              <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                The UTS Floor Axis (Anchor Strategy)
              </Typography>
            </Box>
            
            {/* Visual Axis Line Diagram */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', my: 2, px: 1 }}>
              <Box sx={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', bgcolor: '#cbd5e1', zIndex: 1 }} />
              
              <Box sx={{ zIndex: 2, textAlign: 'center' }}>
                <Chip label="Dis-Chem" size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 'bold', border: '1px solid #cbd5e1' }} />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>P.A</Typography>
              </Box>

              <Box sx={{ zIndex: 2, textAlign: 'center' }}>
                <Chip label="Clicks" size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 'bold', border: '1px solid #cbd5e1' }} />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>P.B</Typography>
              </Box>

              <Box sx={{ zIndex: 2, textAlign: 'center' }}>
                <Chip label="GAME" color="primary" size="small" sx={{ fontWeight: 'bold', boxShadow: '0 2px 4px rgba(79,70,229,0.2)' }} />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'primary.main', fontWeight: 'bold' }}>ANCHOR</Typography>
              </Box>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1, fontStyle: 'italic' }}>
              *Trace distances and parkings (A, B, E, G) directly from your Game Anchor point.
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="subtitle2" color="text.secondary" fontWeight="700" sx={{ mb: 1.5, px: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Training Operations Manual
        </Typography>

        {/* 3. The 9 Core Course Topics Accordion Engine */}
        
        {/* Topic 1 */}
        <Accordion disableGutters elevation={0} variant="outlined" sx={{ borderRadius: '8px !important', mb: 1.5, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight="700">🥾 Topic 1: Presentation & Survival Gear</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: '#fafafa', borderTop: '1px solid #e2e8f0', p: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
              <strong>Safety Footwear:</strong> Hard steel-toe safety boots are mandatory at all times to protect your feet from rolling heavy metal chassis frames.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
              <strong>Identification:</strong> Wear your official UTS coat (Idansane) with your branded high-vis reflector vest securely over it. No unknown graphic t-shirts are permitted on the floor.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              <strong>Equipment:</strong> Always carry a 10m anchor rope for braking control and a charged smartphone to call for floor backup or report hazards.
            </Typography>
            <Box sx={{ mt: 2, height: '140px', bgcolor: '#e2e8f0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
              <PlayCircleOutlineIcon sx={{ color: '#64748b', fontSize: 32 }} />
              <Typography variant="caption" color="text.secondary" fontWeight="bold">[VIDEO: Official Uniform & Gear Walkthrough]</Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Topic 2 */}
        <Accordion disableGutters elevation={0} variant="outlined" sx={{ borderRadius: '8px !important', mb: 1.5, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight="700">📱 Topic 2: Real-Time Team Communication</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: '#fafafa', borderTop: '1px solid #e2e8f0', p: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
              <strong>Active Data Lifeline:</strong> Your smartphone must remain powered on with live data during your entire shift so teammates and supervisors can track positions.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              <strong>Broadcast Protocol:</strong> Constantly update the team WhatsApp group when shifting locations, discovering parking pile-ups, or triggering emergency backup calls.
            </Typography>
            <Box sx={{ mt: 2, height: '140px', bgcolor: '#e2e8f0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
              <PlayCircleOutlineIcon sx={{ color: '#64748b', fontSize: 32 }} />
              <Typography variant="caption" color="text.secondary" fontWeight="bold">[VIDEO: WhatsApp Broadcast Templates Demonstration]</Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Topic 3 */}
        <Accordion disableGutters elevation={0} variant="outlined" sx={{ borderRadius: '8px !important', mb: 1.5, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight="700">🏪 Topic 3: Store Relationships & Panic Mode</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: '#fafafa', borderTop: '1px solid #e2e8f0', p: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
              <strong>The Empty Bay Rule:</strong> Store entrances must never hit zero units. If a bay goes empty, activate 'Panic Mode' instantly: shout for backup on WhatsApp and sprint to the nearest parking lot for immediate relief stacks.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
              <strong>Manager Relations:</strong> Always speak respectfully to store managers. They hold the power to terminate the entire UTS contract on the spot. Show them you are actively trying.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              <strong>In-Store Sweeps:</strong> Execute regular runs inside store backrooms and receiving bays to reclaim units hoarded by floor workers.
            </Typography>
            <Box sx={{ mt: 2, height: '140px', bgcolor: '#e2e8f0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
              <PlayCircleOutlineIcon sx={{ color: '#64748b', fontSize: 32 }} />
              <Typography variant="caption" color="text.secondary" fontWeight="bold">[VIDEO: Managing Store Bays & Backroom Sweeps]</Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Topic 4 */}
        <Accordion disableGutters elevation={0} variant="outlined" sx={{ borderRadius: '8px !important', mb: 1.5, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight="700">🛒 Topic 4: Trolley Physics & Stacking</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: '#fafafa', borderTop: '1px solid #e2e8f0', p: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
              <strong>Clamp Trap:</strong> Never rely on built-in metal clamps for long lines. High speeds cause them to warp and snap, sending runaway steel into shoppers or cars.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
