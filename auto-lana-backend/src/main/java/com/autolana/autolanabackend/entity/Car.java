package com.autolana.autolanabackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "cars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    private Integer year;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double dailyPrice;

    @Column(length = 2000)
    private String description;

    private String imageUrl;
    @ElementCollection
    @CollectionTable(
            name = "car_images",
            joinColumns = @JoinColumn(name = "car_id")
    )
    @Column(name = "image_url")
    private java.util.List<String> imageUrls;

    @Column(nullable = false)
    private Boolean active = true;
}
