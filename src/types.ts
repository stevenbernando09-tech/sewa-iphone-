export interface iPhoneModel {
  id: string;
  name: string;
  series: string;
  pricePerDay: number;
  specs: {
    chip: string;
    camera: string;
    display: string;
  };
  image: string;
  isNew?: boolean;
}

export interface CameraModel {
  id: string;
  name: string;
  brand: string;
  pricePerDay: number;
  specs: {
    sensor: string;
    video: string;
    iso: string;
  };
  image: string;
  isNew?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}
