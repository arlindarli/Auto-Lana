package com.autolana.autolanabackend.service;

import com.autolana.autolanabackend.entity.Car;
import com.autolana.autolanabackend.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Makina nuk u gjet."));
    }

    public Car createCar(Car car) {
        return carRepository.save(car);
    }

    public Car updateCar(Long id, Car carDetails) {

        Car car = getCarById(id);

        car.setBrand(carDetails.getBrand());
        car.setModel(carDetails.getModel());
        car.setYear(carDetails.getYear());
        car.setCategory(carDetails.getCategory());
        car.setDailyPrice(carDetails.getDailyPrice());
        car.setDescription(carDetails.getDescription());
        car.setImageUrl(carDetails.getImageUrl());
        car.getImageUrls().clear();

        if (carDetails.getImageUrls() != null) {
            car.getImageUrls().addAll(carDetails.getImageUrls());
        }
        car.setActive(carDetails.getActive());

        return carRepository.save(car);
    }
    public void deleteCar(Long id) {

        getCarById(id);

        carRepository.deleteById(id);
    }
}