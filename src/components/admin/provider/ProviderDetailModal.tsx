"use client";
import React from "react"; 
import { Modal } from "@/components/global/Modal"; 
import { ProviderDetail } from "./ProviderDetailContent";  

interface ProviderDetailModalProps {   
  token: string;   
  isOpen: boolean; 
  onClose: () => void; 
  providerId: number | null;
}  

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({   
  token,   
  isOpen,   
  onClose,   
  providerId 
}) => {   
  return (     
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="lg"
    >
      <div style={{ width: '600px', maxWidth: '100%' }}>
        <ProviderDetail           
          token={token}         
          isOpen={isOpen}       
          onClose={onClose}     
          providerId={providerId} 
        />
      </div>
    </Modal>   
  ); 
};