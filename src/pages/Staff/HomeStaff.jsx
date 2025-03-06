"use client";

import React from "react";
import { useLocation } from "react-router-dom";
import { AppointmentDetails } from "../../components/Staff/Appointment/AppointmentDetails";
import { StaffClients } from "../../components/Staff/Client/StaffClient";
import { StaffList } from "../../components/Staff/Employee/StaffList";
import { StaffSchedule } from "../../components/Staff/StaffSchedule";
import { AppointmentCalendar } from "../../components/Staff/Appointment/AppointmentCalendar";
import AppSidebar from "../../components/Staff/Sidebar";
import { Header } from "../../components/Staff/Header/Header";

export default function HomeStaff() {
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case "/staff/home":
      case "/staff/appointments":
        return (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <AppointmentCalendar
                onAppointmentSelect={setSelectedAppointment}
                selectedAppointmentId={selectedAppointment}
              />
            </div>
            <div className="w-full md:w-96 border rounded-lg bg-white shadow">
              {selectedAppointment ? (
                <AppointmentDetails appointmentId={selectedAppointment} />
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Select an appointment to view details
                </div>
              )}
            </div>
          </div>
        );
      case "/staff/clients":
        return <StaffClients />;
      case "/staff/skintherapist":
        return <StaffList />;
      case "/staff/schedule":
        return <StaffSchedule />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">{renderContent()}</main>
      </div>
    </div>
  );
}
