package com.autolana.autolanabackend.repository;

import com.autolana.autolanabackend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCarId(Long carId);

    boolean existsByCarIdAndStatusNotAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long carId,
            String status,
            LocalDate endDate,
            LocalDate startDate
    );
}
