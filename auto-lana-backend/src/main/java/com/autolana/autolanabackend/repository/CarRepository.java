package com.autolana.autolanabackend.repository;

import com.autolana.autolanabackend.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Car, Long> {
}