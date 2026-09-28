import styled from "styled-components";

interface SpanProps {
  color?: string;
}

// --- Global Typography ---
export const MainTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSize.h1};
  font-weight: 400;
  color: ${(props) => props.color || props.theme.colors.primary};
  text-align: center;
  letter-spacing: 0.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: 600;
  color: ${(props) => props.color || props.theme.colors.primary};
  text-align: left;
  letter-spacing: 0.2rem;
`;

export const BodyText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text};
  font-style: normal;
  line-height: 22px;
  text-align: left;
`;

export const StyledSpan = styled.span<SpanProps>`
  color: ${({ color }) => color || "#1E1E1E"};
`;

// --- Form Fields & Semantics ---
export const FormLabel = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text};
  font-style: normal;
  line-height: 22px;
  text-align: left;
`;

export const InputErrorMessage = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.error};
  font-style: normal;
  line-height: 22px;
  text-align: left;
  display: block; /* Ensures it drops beneath the input */
`;

export const FormErrorMessage = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.error};
  font-style: normal;
  line-height: 22px;
  text-align: left;
`;

// --- Form Links & Layout Wrappers ---
export const ForgotPasswordWrapper = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.primary};
  text-align: right;

  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const FormSwitchText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.primary};
  text-align: left;

  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.primary};
  }
`;
