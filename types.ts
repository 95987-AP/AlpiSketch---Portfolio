import React from 'react';

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  year: string;
  tags: string[];
  slides?: string[];
  logoGrid?: string[];
  posterGrid?: string[];
}

export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}