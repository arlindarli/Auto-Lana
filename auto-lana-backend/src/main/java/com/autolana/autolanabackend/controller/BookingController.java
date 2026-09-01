package com.autolana.autolanabackend.controller;

import com.autolana.autolanabackend.entity.Booking;
import com.autolana.autolanabackend.service.BookingService;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @GetMapping("/car/{carId}/availability")
    public Map<String, Boolean> checkAvailability(
            @PathVariable Long carId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        boolean available = bookingService.isCarAvailable(carId, startDate, endDate);

        return Map.of("available", available);
    }
    @GetMapping("/car/{carId}")
    public List<Booking> getBookingsByCar(@PathVariable Long carId) {
        return bookingService.getBookingsByCar(carId);
    }

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }


    @PostMapping("/car/{carId}")
    public Booking createBooking(@PathVariable Long carId,
                                 @RequestBody Booking booking) {
        return bookingService.createBooking(carId, booking);
    }
    @PutMapping("/{bookingId}/status")
    public Booking updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request) {

        String status = request.get("status");

        return bookingService.updateBookingStatus(bookingId, status);
    }
}
