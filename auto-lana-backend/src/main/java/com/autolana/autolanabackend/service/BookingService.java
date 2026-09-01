package com.autolana.autolanabackend.service;

import com.autolana.autolanabackend.entity.Booking;
import com.autolana.autolanabackend.entity.Car;
import com.autolana.autolanabackend.repository.BookingRepository;
import com.autolana.autolanabackend.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.time.LocalDate;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;

    public BookingService(BookingRepository bookingRepository,
                          CarRepository carRepository) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking createBooking(Long carId, Booking booking) {

        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (booking.getStartDate() == null || booking.getEndDate() == null) {
            throw new RuntimeException("Start date and end date are required");
        }

        if (booking.getEndDate().isBefore(booking.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        boolean alreadyBooked =
                bookingRepository
                        .existsByCarIdAndStatusNotAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                                carId,
                                "CANCELLED",
                                booking.getEndDate(),
                                booking.getStartDate()
                        );

        if (alreadyBooked) {
            throw new RuntimeException("Car is already booked for these dates");
        }

        long numberOfDays =
                ChronoUnit.DAYS.between(
                        booking.getStartDate(),
                        booking.getEndDate()
                ) + 1;

        double totalPrice = numberOfDays * car.getDailyPrice();

        booking.setCar(car);
        booking.setTotalPrice(totalPrice);
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }
        public List<Booking> getBookingsByCar(Long carId) {
            return bookingRepository.findByCarId(carId);
        }
    public boolean isCarAvailable(Long carId, LocalDate startDate, LocalDate endDate) {
        return !bookingRepository
                .existsByCarIdAndStatusNotAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        carId,
                        "CANCELLED",
                        endDate,
                        startDate
                );
    }
    public Booking updateBookingStatus(Long bookingId, String status) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!status.equals("PENDING")
                && !status.equals("CONFIRMED")
                && !status.equals("CANCELLED")) {
            throw new RuntimeException("Invalid booking status");
        }

        booking.setStatus(status);

        return bookingRepository.save(booking);
    }
    }

