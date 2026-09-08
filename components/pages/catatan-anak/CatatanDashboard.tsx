"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    IconPlus
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { Button } from "../../../components/ui/Button"; 
import { callApi } from "@/lib/api";
import { BadgeStatus } from "../../../components/ui/BadgeStatus";
import Swal from 'sweetalert2';

export function CatatanDashboard() {
    return (
        <>


            <Toaster position="top-right" />
        </>
    );
}